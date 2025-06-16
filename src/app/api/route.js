import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://srivallabhmanyam:3kkZUrfPAg6SZ12W@buildingskills.igpamrg.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

let db = null;

async function getDb() {
  if (db) return db;
  try {
    await client.connect();
    db = client.db('Scrapping');
    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw new Error("Database connection failed");
  }
}

function mergeCompanyDocs(arr) {
  // arr is an array of docs like [{_id, meta: [...]}, {_id, google: [...]}, ...]
  const merged = {};
  for (const doc of arr) {
    for (const key of Object.keys(doc)) {
      if (key !== '_id') {
        merged[key] = doc[key];
      }
    }
  }
  return merged;
}

export async function getData() {
  try {
    const database = await getDb();
    const topnews = await database.collection("topnews").find().toArray();
    const layoffsArr = await database.collection("layoffs").find().toArray();
    const stockdataArr = await database.collection("stockdata").find().toArray();
    const insightsArr = await database.collection("insights").find().toArray();

    const layoffs = mergeCompanyDocs(layoffsArr);
    const stockdata = mergeCompanyDocs(stockdataArr);
    const insights = mergeCompanyDocs(insightsArr);

    return {
      topnews,
      layoffs,
      stockdata,
      insights,
    };
  } catch (error) {
    console.error("Failed to get collection:", error);
    throw new Error("Collection access failed");
  }
}

