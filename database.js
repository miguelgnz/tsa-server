import { MongoClient, ServerApiVersion } from 'mongodb'
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@tsacluster.6yau5.mongodb.net/?retryWrites=true&w=majority&appName=tsacluster`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

let _db

export const mongoConnect = (callback) => {
  client
    .connect()
    .then((result) => {
      console.log('Connected to MongoDB')
      _db = client.db('tsa-db')
      callback(result)
    })
    .catch((err) => {
      console.error(err)
      throw new Error('Failed to connect to MongoDB')
    })
}

export const getDb = () => {
  if (_db) {
    return _db
  }
  throw new Error('No database found')
}
