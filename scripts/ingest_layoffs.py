import json
import re

from ingest.common import (
    TICKERS,
    base_article_from_google_item,
    calculate_liquidity_change,
    fetch_from_google_cse,
    groq_response,
    sentiment_analysis,
    sleep_between_calls,
    upload_company_collection,
)


def layoff_query(ticker):
    return (
        f"{ticker} (layoff OR layoffs OR fired OR job cuts OR workforce reduction "
        "OR hiring OR hires OR employed OR recruitment OR expansion)"
    )


def extraction_prompt(ticker, article):
    return f"""From the article below, extract:
1. The main layoff number strictly related to {ticker}; return "0" if none.
2. The main reason for the layoffs as a short phrase or sentence.

Return JSON with fields "layoffs" and "reason".

Title: {article.get('title')}
Summary: {article.get('summary')}"""


def enrich_layoff_article(ticker, article):
    try:
        response = groq_response(extraction_prompt(ticker, article), need_json=True)
        match = re.search(r"\{.*\}", response, re.DOTALL)
        data = json.loads(match.group(0)) if match else {}
        article["layoffs"] = data.get("layoffs", "")
        article["reason"] = data.get("reason", "")
    except Exception as exc:
        print(f"Layoff extraction failed for {article.get('title')}: {exc}")
        article["layoffs"] = ""
        article["reason"] = ""

    article["liquidity"] = calculate_liquidity_change(article)
    article["sentiment"] = sentiment_analysis(article.get("summary", ""))
    return article


def build_layoffs(limit_per_ticker=10):
    results = {}
    seen_urls = set()

    for ticker in TICKERS:
        records = []
        for item in fetch_from_google_cse(layoff_query(ticker)):
            url = item.get("link")
            if not url or url in seen_urls:
                continue

            seen_urls.add(url)
            article = base_article_from_google_item(item, ticker=ticker)
            records.append(enrich_layoff_article(ticker, article))
            sleep_between_calls()

            if len(records) >= limit_per_ticker:
                break

        results[ticker] = records

    return results


def main():
    records_by_ticker = build_layoffs()
    upload_company_collection("layoffs", records_by_ticker)


if __name__ == "__main__":
    main()
