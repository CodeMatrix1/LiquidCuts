import json
import os
import re
import time
from datetime import timedelta

import pandas as pd
import requests
import yfinance as yf
from bs4 import BeautifulSoup
from groq import Groq
from pymongo import MongoClient

TICKERS = ["meta", "google", "microsoft", "apple", "amazon"]

COMPANY_TO_TICKER = {
    "meta": "META",
    "amazon": "AMZN",
    "microsoft": "MSFT",
    "google": "GOOGL",
    "apple": "AAPL",
}

REQUEST_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}


def require_env(name):
    value = os.getenv(name)
    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


def get_database():
    uri = require_env("MONGODB_URI")
    db_name = os.getenv("MONGO_DB_NAME", "Scrapping")
    client = MongoClient(uri)
    client.admin.command("ping")
    return client[db_name]


def fetch_from_google_cse(query, start=1):
    params = {
        "q": query,
        "key": require_env("GOOGLE_API_KEY"),
        "cx": require_env("GOOGLE_CX"),
        "start": start,
    }
    response = requests.get(
        "https://www.googleapis.com/customsearch/v1",
        params=params,
        timeout=20,
    )
    response.raise_for_status()
    return response.json().get("items", [])


def get_published_date(item):
    try:
        metatags = item.get("pagemap", {}).get("metatags", [{}])
        value = metatags[0].get("article:published_time") if metatags else None
        return value[:10] if value else None
    except (KeyError, IndexError, TypeError):
        return None


def groq_response(prompt, need_json=False):
    client = Groq(api_key=require_env("GROQ_API_KEY"))
    kwargs = {
        "model": os.getenv("GROQ_MODEL", "llama3-8b-8192"),
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.1,
    }
    if need_json:
        kwargs["response_format"] = {"type": "json_object"}

    response = client.chat.completions.create(**kwargs)
    return response.choices[0].message.content


def extract_article_text(url):
    response = requests.get(url, headers=REQUEST_HEADERS, timeout=15)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")

    results = []
    for tag in ["h1", "h2", "h3", "h4", "p", "ul", "ol"]:
        results.extend(soup.find_all(tag))

    text = " ".join(
        element.get_text(separator=" ", strip=True) for element in results
    )
    return re.sub(r"\s+", " ", text).strip()


def summarize(url):
    try:
        text = extract_article_text(url)
        if len(text.split()) < 80:
            return "Insufficient meaningful content for summarization"

        prompt = f"""Generate a concise news summary focusing on:
- Key entities, including companies, people, and figures
- Financial impacts and numbers

Article content:
{text[:3000]}

Summary: one sentence, journalistic tone."""
        return groq_response(prompt)
    except Exception as exc:
        print(f"Error summarizing {url}: {str(exc)[:200]}")
        return "Summary unavailable. The article may be paywalled or structured unusually."


def sentiment_analysis(text):
    try:
        from transformers import pipeline

        wrapper = pipeline("sentiment-analysis")
        result = wrapper(text[:512])[0]
        score = result["score"]
        return -score if result["label"] == "NEGATIVE" else score
    except Exception:
        return None


def calculate_liquidity_change(article, window_days=3):
    if not article.get("date") or not article.get("ticker"):
        return None

    try:
        event_date = pd.to_datetime(article["date"]).tz_localize("UTC")
        ticker_symbol = COMPANY_TO_TICKER.get(article["ticker"].lower())
        if not ticker_symbol:
            return None

        start = event_date - timedelta(days=window_days + 7)
        end = event_date + timedelta(days=window_days + 7)
        stock = yf.Ticker(ticker_symbol)
        hist = stock.history(
            start=start.strftime("%Y-%m-%d"),
            end=end.strftime("%Y-%m-%d"),
            interval="1d",
        )

        if hist.empty:
            return None

        hist.index = hist.index.tz_convert("UTC")
        nearest_date = hist.index[abs(hist.index - event_date).argmin()]
        pre_dates = hist.index[hist.index < nearest_date][-window_days:]
        post_dates = hist.index[hist.index > nearest_date][:window_days]

        if len(pre_dates) < 2 or len(post_dates) < 2:
            return None

        pre_vol = hist.loc[pre_dates, "Volume"].mean()
        post_vol = hist.loc[post_dates, "Volume"].mean()
        vol_change = ((post_vol - pre_vol) / pre_vol) * 100

        pre_spread = (hist.loc[pre_dates, "High"] - hist.loc[pre_dates, "Low"]).mean()
        post_spread = (hist.loc[post_dates, "High"] - hist.loc[post_dates, "Low"]).mean()
        spread_change = ((post_spread - pre_spread) / pre_spread) * 100

        return round((vol_change + spread_change) / 2, 1)
    except Exception as exc:
        print(f"Liquidity calculation failed for {article.get('title')}: {exc}")
        return None


def normalize_for_mongo(value):
    if isinstance(value, dict):
        return {key: normalize_for_mongo(item) for key, item in value.items()}
    if isinstance(value, list):
        return [normalize_for_mongo(item) for item in value]
    if isinstance(value, pd.Timestamp):
        return value.strftime("%Y-%m-%d")
    if hasattr(value, "item"):
        return value.item()
    return value


def upload_topnews(records, replace=True):
    db = get_database()
    collection = db["topnews"]
    if replace:
        collection.delete_many({})
    if records:
        collection.insert_many(normalize_for_mongo(records))
    print(f"Uploaded {len(records)} top news records")


def upload_company_collection(collection_name, records_by_ticker):
    db = get_database()
    collection = db[collection_name]
    for ticker, records in records_by_ticker.items():
        payload = {ticker: normalize_for_mongo(records)}
        collection.replace_one({ticker: {"$exists": True}}, payload, upsert=True)
        print(f"Uploaded {len(records)} {collection_name} records for {ticker}")


def base_article_from_google_item(item, ticker=None):
    url = item.get("link")
    return {
        "ticker": ticker,
        "title": item.get("title"),
        "url": url,
        "summary": summarize(url) if url else item.get("snippet"),
        "date": get_published_date(item),
    }


def dedupe_by_url(records):
    seen = set()
    deduped = []
    for record in records:
        url = record.get("url")
        if not url or url in seen:
            continue
        seen.add(url)
        deduped.append(record)
    return deduped


def sleep_between_calls(seconds=1):
    if seconds > 0:
        time.sleep(seconds)
