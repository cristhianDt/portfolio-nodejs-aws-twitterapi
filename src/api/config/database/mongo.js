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
const schemas = require('../../common/getSchemas')
const shouldUseMongoose = getFeatureFlagValue(USE_MONGOOSE)

const uri = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER_URL}/${MONGODB_DATABASE_NAME}?retryWrites=true&writeConcern=majority`
logger.info(`Mongodb uri: ${uri} using mongoose: ${shouldUseMongoose}`)

exports.init = () => {
  return new Promise(async (resolve, reject) => {
    let client, db
    try {
      // Connect the client to the server
      if (shouldUseMongoose) {
        client = await mongoose.createConnection(uri) //https://mongoosejs.com/docs/2.7.x/docs/model-definition.html | https://mongoosejs.com/docs/connections.html
        await registerModels(client)
      } else {
        // noinspection JSCheckFunctionSignatures
        client = new MongoClient(uri, {
          connectTimeoutMS: 60000,
          socketTimeoutMS: 60000,
          useNewUrlParser: true,
          useUnifiedTopology: true
        })
        await client.connect()
        db = client.db(MONGODB_DATABASE_NAME)
        await db.collections().then(data => {
          data.forEach(item => {
            return db[item.collectionName] = db.collection(item.collectionName)
          })
        })
      }
      const msg = 'Connected successfully to mongo database'
      logger.info(msg)
      console.log(msg)
      resolve(shouldUseMongoose ? client : db)
      exports.getCollection = shouldUseMongoose ? client : db
    } catch (err) {
      logger.error('Error connecting to mongodb', err)
      await client.close()
      reject(err)
    }
  })
}


/**
 * @łink https://mongoosejs.com/docs/api/connection.html#connection_Connection-model
 * @param db
 * @returns {Promise<void>}
 */
async function registerModels(db) {
  Object.keys(schemas).forEach((key) => {
    const schema = schemas[key]
    Object.keys(schema).forEach((subSchema) => {
      db.model(subSchema, schema[subSchema]);
    })
  })
}

exports.db = shouldUseMongoose && mongoose.createConnection(uri) //https://mongoosejs.com/docs/2.7.x/docs/model-definition.html | https://mongoosejs.com/docs/connections.html

exports.ObjectID = ObjectId