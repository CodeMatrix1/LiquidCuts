import pandas as pd
import yfinance as yf

from ingest.common import COMPANY_TO_TICKER, TICKERS, upload_company_collection


def get_monthly_liquidity(ticker, period="3y"):
    symbol = COMPANY_TO_TICKER[ticker.lower()]
    stock = yf.Ticker(symbol)
    hist = stock.history(period=period, interval="1d")

    if hist.empty:
        return []

    hist.index = pd.to_datetime(hist.index)
    hist["Spread"] = hist["High"] - hist["Low"]

    monthly = hist.groupby([hist.index.year, hist.index.month]).agg(
        {
            "Volume": "mean",
            "Spread": "mean",
        }
    )
    monthly["date"] = monthly.index.map(lambda item: f"{item[0]}-{item[1]:02d}")
    monthly.rename(
        columns={"Volume": "Avg_Volume", "Spread": "Avg_Spread"},
        inplace=True,
    )

    return monthly.reset_index(drop=True).to_dict(orient="records")


def build_stockdata(period="3y"):
    return {ticker: get_monthly_liquidity(ticker, period=period) for ticker in TICKERS}


def main():
    records_by_ticker = build_stockdata()
    upload_company_collection("stockdata", records_by_ticker)


if __name__ == "__main__":
    main()
