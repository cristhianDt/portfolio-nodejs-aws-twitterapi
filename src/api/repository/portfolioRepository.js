const logger = require('../config/logger/logger')
const mongoDbClient = require('./models/mongoDbClient')
const dynamoDbClient = require('./models/dynamoDbClient')

const {
  getFeatureFlagValue,
  features: { USE_MONGOOSE, USE_DYNAMODB }
} = require('../config/featureFlags')
const dynamoDBEnabled = getFeatureFlagValue(USE_DYNAMODB)
const shouldUseMongoose = getFeatureFlagValue(USE_MONGOOSE)

/**
 * @link https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Classes
 */
class DbClient {
  /** @var #client './models/dynamoDbClient' */
  #client

  constructor(useDynamoDb = dynamoDBEnabled, useMongoose = shouldUseMongoose) {
    this.useDynamoDb = useDynamoDb
    this.useMongoose = useMongoose
    this.#client = this.createClient()
  }

  createClient() {
    if (this.useDynamoDb) {
      return new dynamoDbClient()
    } else {
      return new mongoDbClient(this.useMongoose)
    }
  }

  get client() {
    logger.info(`DbClient ready: useDynamoDb:${this.useDynamoDb} is dynamo client:${this.#client instanceof dynamoDbClient}`)
    return this.#client
  }

  getPortfolioById(id) {
    return this.#client.getPortfolioById(id)
  }
}

module.exports = new DbClient()
