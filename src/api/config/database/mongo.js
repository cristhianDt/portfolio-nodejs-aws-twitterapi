const { MongoClient, ObjectId } = require('mongodb')
const logger = require("../logger/logger")
const {
  MONGODB_CLUSTER_URL,
  MONGODB_DATABASE_NAME,
  MONGODB_USERNAME,
  MONGODB_PASSWORD
} = process.env

const uri = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER_URL}/${MONGODB_DATABASE_NAME}?retryWrites=true&writeConcern=majority`
logger.info(`Mongodb uri: ${uri}`)
// noinspection JSCheckFunctionSignatures
const client = new MongoClient(uri, {
  connectTimeoutMS: 60000,
  socketTimeoutMS: 60000,
  useNewUrlParser: true,
  useUnifiedTopology: true
})

exports.init = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Connect the client to the server
      await client.connect()
      let db = client.db(MONGODB_DATABASE_NAME)
      await db.collections().then(data => {
        data.forEach(item => {
          return db[item.collectionName] = db.collection(item.collectionName)
        })
      })
      resolve(db)
      exports.getCollection = db
      const msg = "Connected successfully to mongo database"
      logger.info(msg)
      console.log(msg)
    } catch (err) {
      logger.error('Error connecting to mongodb', err)
      reject(err)
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close()
    }
  })
}

exports.ObjectID = ObjectId