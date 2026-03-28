import { MongoClient } from "mongodb";

const url = process.env.MONGO_URI;
const dbName = "primetrade";

const client = new MongoClient(url);

let db;

export const connection = async () => {
  if (!db) {
    await client.connect();
    db = client.db(dbName);
    console.log("MongoDB Connected!");
  }
  return db;
};