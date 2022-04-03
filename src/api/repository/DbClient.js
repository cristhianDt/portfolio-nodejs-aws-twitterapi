const logger = require('../config/logger/logger')
const MongoDbClient = require('./models/MongoDbClient')
const DynamoDbClient = require('./models/DynamoDbClient')
const DbInterface = require('./models/DbInterface')

const {
  getFeatureFlagValue,
  features: { USE_MONGOOSE, USE_DYNAMODB }
} = require('../config/featureFlags')
const dynamoDBEnabled = getFeatureFlagValue(USE_DYNAMODB)
const shouldUseMongoose = getFeatureFlagValue(USE_MONGOOSE)

/**
 * @link https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Classes
 */
class DbClient extends DbInterface {
  /** @var #client './models/dynamoDbClient' */
  #client

  constructor(tableName = 'Portfolio', useDynamoDb = dynamoDBEnabled, useMongoose = shouldUseMongoose) {
    super()
    this.tableName = tableName
    this.useDynamoDb = useDynamoDb
    this.useMongoose = useMongoose
    this.#client = this.createClient(tableName)
    logger.info(`New DbClient: useDynamoDb:${this.useDynamoDb} is dynamo client:${this.#client instanceof DynamoDbClient}`)
  }

  createClient(tableName) {
    if (this.useDynamoDb) {
      return new DynamoDbClient(tableName)
    } else {
      return new MongoDbClient(this.useMongoose)
    }
  }

  get client() {
    return this.#client
  }

  getPortfolioById(id) {
    return this.#client.getPortfolioById(id)
  }

  upSertPortfolio(portfolioId, update) {
    return this.#client.upSertPortfolio(portfolioId, update)
  }
}

module.exports = DbClient
