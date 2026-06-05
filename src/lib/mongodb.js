import { MongoClient } from "mongodb";

let client;
let db;

export async function getDb() {
  if (db) return db;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  client = client || new MongoClient(uri);
  await client.connect();
  db = client.db("Scrapping");

  return db;
}
