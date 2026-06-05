from ingest.common import (
    TICKERS,
    base_article_from_google_item,
    calculate_liquidity_change,
    fetch_from_google_cse,
    sentiment_analysis,
    upload_company_collection,
)

CRITICAL_EVENT_KEYWORDS = {
    "layoffs": ["layoff", "layoffs", "job cuts", "restructuring"],
    "legal issues": ["legal action", "lawsuit", "sue", "settlement", "court"],
}


def process_labels(text):
    lowered = (text or "").lower()
    labels = []
    for label, keywords in CRITICAL_EVENT_KEYWORDS.items():
        if any(keyword in lowered for keyword in keywords):
            labels.append(label)
    return labels


def build_insights(limit_per_ticker=10, pages_per_ticker=2):
    results = {}
    seen_urls = set()

    for ticker in TICKERS:
        records = []
        for page in range(pages_per_ticker):
            start = page * 10 + 1
            query = f"broad news from {ticker} -stock -price -market"
            for item in fetch_from_google_cse(query, start=start):
                url = item.get("link")
                if not url or url in seen_urls:
                    continue

                seen_urls.add(url)
                article = base_article_from_google_item(item, ticker=ticker)
                article["labels"] = process_labels(article.get("summary", ""))
                article["sentiment"] = sentiment_analysis(article.get("summary", ""))
                article["liquidity"] = calculate_liquidity_change(article)
                records.append(article)

                if len(records) >= limit_per_ticker:
                    break

            if len(records) >= limit_per_ticker:
                break

        results[ticker] = records

    return results


def main():
    records_by_ticker = build_insights()
    upload_company_collection("insights", records_by_ticker)


if __name__ == "__main__":
    main()
