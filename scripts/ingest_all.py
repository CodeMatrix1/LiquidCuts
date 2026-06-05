from ingest_insights import build_insights
from ingest_layoffs import build_layoffs
from ingest_stockdata import build_stockdata
from ingest_topnews import build_topnews
from ingest.common import upload_company_collection, upload_topnews


def main():
    upload_topnews(build_topnews())
    upload_company_collection("layoffs", build_layoffs())
    upload_company_collection("stockdata", build_stockdata())
    upload_company_collection("insights", build_insights())


if __name__ == "__main__":
    main()
