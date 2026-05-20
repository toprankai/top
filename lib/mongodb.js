import { MongoClient } from 'mongodb'
import { applyMongoUrlEnv, normalizeMongoUrl } from './mongo-url'

applyMongoUrlEnv()

const MONGO_URL = normalizeMongoUrl(process.env.MONGO_URL)
const DB_NAME = process.env.DB_NAME || 'local_rank_heatmap'

let client
let clientPromise

if (MONGO_URL) {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(MONGO_URL, {
        connectTimeoutMS: 5000,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 10000,
      })
      global._mongoClientPromise = client.connect().catch(err => {
        console.error('CRITICAL: MongoDB Connection Failed', err.message)
        throw err
      })
    }
    clientPromise = global._mongoClientPromise
  } else {
    client = new MongoClient(MONGO_URL, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
    })
    clientPromise = client.connect()
  }
}

export async function getDB() {
  if (!MONGO_URL) {
    throw new Error('CRITICAL: MONGO_URL not found in environment. Please check your .env or Docker config.')
  }
  try {
    const client = await clientPromise
    return client.db(DB_NAME)
  } catch (err) {
    console.error('getDB Error:', err.message)
    throw new Error('Database connection failed. Please check IP Whitelist.')
  }
}

export default clientPromise
