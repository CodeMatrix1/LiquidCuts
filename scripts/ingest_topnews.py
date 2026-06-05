from ingest.common import (
    TICKERS,
    base_article_from_google_item,
    calculate_liquidity_change,
    fetch_from_google_cse,
    sentiment_analysis,
    upload_topnews,
)


def infer_ticker(item):
    text = f"{item.get('title', '')} {item.get('snippet', '')}".lower()
    for ticker in TICKERS:
        if ticker in text:
            return ticker
    return None


def build_topnews(limit=10):
    query = "top tech news from meta, amazon, microsoft, google or apple"
    records = []

    for item in fetch_from_google_cse(query):
        ticker = infer_ticker(item)
        article = base_article_from_google_item(item, ticker=ticker)
        article["sentiment"] = sentiment_analysis(article.get("summary", ""))
        article["liquidity"] = calculate_liquidity_change(article)
        records.append(article)

        if len(records) >= limit:
            break

    return records


def main():
    records = build_topnews()
    upload_topnews(records)


if __name__ == "__main__":
    main()
