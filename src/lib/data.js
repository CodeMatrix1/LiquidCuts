import { getDb } from "@/lib/mongodb";

const COMPANY_COLLECTIONS = ["layoffs", "stockdata", "insights"];

function mergeCompanyDocs(docs) {
  const merged = {};

  for (const doc of docs) {
    for (const key of Object.keys(doc)) {
      if (key !== "_id") {
        merged[key] = doc[key];
      }
    }
  }

  return merged;
}

export async function getData() {
  const database = await getDb();
  const topnews = await database.collection("topnews").find().toArray();
  const layoffs = mergeCompanyDocs(
    await database.collection("layoffs").find().toArray()
  );
  const stockdata = mergeCompanyDocs(
    await database.collection("stockdata").find().toArray()
  );
  const insights = mergeCompanyDocs(
    await database.collection("insights").find().toArray()
  );

  return {
    topnews,
    layoffs,
    stockdata,
    insights,
  };
}

export async function getCollectionData(collectionName) {
  const data = await getData();
  return data[collectionName];
}

export async function getFilteredCollectionData(collectionName, filters = {}) {
  if (filters.ticker && COMPANY_COLLECTIONS.includes(collectionName)) {
    const database = await getDb();
    const doc = await database.collection(collectionName).findOne(
      { [filters.ticker]: { $exists: true } },
      { projection: { _id: 0, [filters.ticker]: 1 } }
    );

    return doc?.[filters.ticker] || [];
  }

  return getCollectionData(collectionName);
}
