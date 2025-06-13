import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://srivallabhmanyam:3kkZUrfPAg6SZ12W@buildingskills.igpamrg.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

let db = null;

export async function getDb() {
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

export async function getData(collection) {
  try {
    const database = await getDb();
    return database.collection(collection);
  } catch (error) {
    console.error("Failed to get collection:", error);
    throw new Error("Collection access failed");
  }
}