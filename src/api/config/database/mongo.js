const { MongoClient, ObjectId } = require('mongodb')
const mongoose = require('mongoose')
const logger = require('../logger/logger')
const {
  MONGODB_CLUSTER_URL,
  MONGODB_DATABASE_NAME,
  MONGODB_USERNAME,
  MONGODB_PASSWORD
} = process.env
const {
  getFeatureFlagValue,
  features: { USE_MONGOOSE }
} = require('../featureFlags')
const shouldUseMongoose = getFeatureFlagValue(USE_MONGOOSE)

const uri = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER_URL}/${MONGODB_DATABASE_NAME}?retryWrites=true&writeConcern=majority`
logger.info(`Mongodb uri: ${uri} mongoose: ${shouldUseMongoose}`)
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

exports.db = shouldUseMongoose && mongoose.createConnection(uri) //https://mongoosejs.com/docs/2.7.x/docs/model-definition.html | https://mongoosejs.com/docs/connections.html

exports.ObjectID = ObjectId