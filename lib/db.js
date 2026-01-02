import { MongoClient } from 'mongodb';

let client = null;
let clientPromise = null;

if (!process.env.MONGO_URL) {
  throw new Error('Please add MONGO_URL to .env');
}

const uri = process.env.MONGO_URL;
const options = {};

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getDb() {
  const client = await clientPromise;
  return client.db(process.env.DB_NAME || 'ecommerce_db');
}

export default clientPromise;