export const ALLOWED_COLLECTIONS = ["topnews", "layoffs", "stockdata", "insights"];
export const TICKER_REQUIRED_COLLECTIONS = ["layoffs", "insights"];

export function isAllowedCollection(collectionName) {
  return ALLOWED_COLLECTIONS.includes(collectionName);
}

export function normalizeTicker(ticker) {
  return ticker ? ticker.trim().toLowerCase() : null;
}

export function requiresTicker(collectionName) {
  return TICKER_REQUIRED_COLLECTIONS.includes(collectionName);
}
