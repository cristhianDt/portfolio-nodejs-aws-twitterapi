/*
 * Copyright (c) 2022.
 *
 * File wrote it by Cristhian Torres
 * @cristhianDt
 */
const { GetCommand } = require('@aws-sdk/lib-dynamodb')
const { ListTablesCommand, GetItemCommand } = require('@aws-sdk/client-dynamodb')
const dynamoDB = require('../../common/database/dynamoDB')

const DbInterface = require('./databaseInterface')

// should implement the DbInterface methods
class dynamoDbClient extends DbInterface {
  constructor() {
    super()
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
   * @returns {Promise<Omit<GetItemCommandOutput, "Item"> & {Item?: {[p: string]: NativeAttributeValue}}>}
   */
  async getPortfolioById(portfolioId) {
    let portfolio
    const params = {
      TableName: 'Portfolio',
      Key: {
        portfolioId: portfolioId,
      },
    }
    portfolio = dynamoDB.send(new GetCommand(params));
    return portfolio
  }

  async getByUserId(userId) {
    let portfolio = {}
    return portfolio
  }


  createPutItemInput() {
    return {
      "TableName": "Portfolio",
      "Item": {
        "portfolioId": {
          "N": "0"
        }
      }
    }
  }

  async updatePortfolio(update) {
    /*const params = {
      TableName: 'Portfolio',
      Key: {
        primaryKey: portfolioId,
      },
    }
    const command = new GetItemCommand(params)
    portfolio = await dynamoDB.send(command)*/
  }
}

module.exports = dynamoDbClient