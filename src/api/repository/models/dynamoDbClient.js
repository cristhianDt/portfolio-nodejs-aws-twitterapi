/*
 * Copyright (c) 2022.
 *
 * File wrote it by Cristhian Torres
 * @cristhianDt
 */
const { GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb')
const { ListTablesCommand, GetItemCommand } = require('@aws-sdk/client-dynamodb')
const dynamoDB = require('../../common/database/dynamoDB')

const DbInterface = require('./databaseInterface')
const logger = require('../../config/logger/logger')

// should implement the DbInterface methods
class dynamoDbClient extends DbInterface {
  constructor() {
    super()
    this.TableName = 'Portfolio'
  }

  async getPortfolios() {
    let results = []
    const command = new ListTablesCommand({})
    results = await dynamoDB.send(command)
    return results
  }

  /**
   * @link https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_dynamodb_code_examples.html
   * @param portfolioId
   * @returns {Promise<Omit<GetCommand, "Item"> & {Item?: {[p: string]}}>}
   */
  async getPortfolioById(portfolioId) {
    let portfolio
    const params = {
      TableName: this.TableName,
      Key: {
        portfolioId: parseInt(portfolioId),
      },
    }
    portfolio = await dynamoDB.send(new GetCommand(params))
    return portfolio?.Item
  }

  async getByUserId(userId) {
    let portfolio = {}
    return portfolio
  }

  generateUpdateQuery = (attributes) => {
    let exp = {
      UpdateExpression: 'set',
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {}
    }
    Object.entries(attributes).forEach(([key, item]) => {
      exp.UpdateExpression += ` #${key} = :${key},`;
      exp.ExpressionAttributeNames[`#${key}`] = key;
      exp.ExpressionAttributeValues[`:${key}`] = item
    })
    exp.UpdateExpression = exp.UpdateExpression.slice(0, -1);
    return exp
  }

  /**
   *
   * @param portfolioId
   * @param attributes
   * @returns {Promise<Omit<UpdateCommand, "Attributes" | "ItemCollectionMetrics"> & {Attributes?: {[p: string]}; ItemCollectionMetrics?: Omit<ItemCollectionMetrics, "ItemCollectionKey"> & {ItemCollectionKey?: {[p: string]}}}>}
   */
  async upSertPortfolio(portfolioId, attributes) {
    const params = {
      TableName: this.TableName,
      Key: {
        portfolioId: portfolioId,
      },
      ...this.generateUpdateQuery(attributes)
    }
    // logger.info(`dynamodb upsert item: ${JSON.stringify({ params, command: new UpdateCommand(params) })}`)
    const result = await dynamoDB.send(
      new UpdateCommand(params)
    )
    return result?.$metadata?.httpStatusCode
  }
}

module.exports = dynamoDbClient