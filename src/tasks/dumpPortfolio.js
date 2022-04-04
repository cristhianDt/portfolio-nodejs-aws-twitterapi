/*
 * Copyright (c) 2022.
 *
 * File wrote it by Cristhian Torres
 * @cristhianDt
 */
// noinspection JSUnresolvedVariable

const DynamoDB = require('../api/common/database/DynamoDB')
const { generateUpdateQuery } = require('../api/repository/models/DynamoDbClient')
const { CreateTableCommand, DeleteTableCommand } = require('@aws-sdk/client-dynamodb')
const { UpdateCommand, GetCommand } = require('@aws-sdk/lib-dynamodb')
const { DEFAULT_TABLE_NAME } = process.env

const TABLE_NAME = DEFAULT_TABLE_NAME ?? 'Portfolio'
const DEFAULT_PORTFOLIO_ID = 1

const createPortfolioParams = {
  AttributeDefinitions: [
    {
      AttributeName: 'portfolioId',
      AttributeType: 'N',
    },
  ],
  KeySchema: [
    {
      AttributeName: 'portfolioId',
      KeyType: 'HASH',
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5,
  },
  TableName: TABLE_NAME,
  StreamSpecification: {
    StreamEnabled: false,
  },
}

const createPortfolioItemParams = {
  TableName: TABLE_NAME,
  Item: {
    names: { S: 'Portfolio 1' },
    portfolioId: { N: DEFAULT_PORTFOLIO_ID },
  },
}

async function createTable() {
  try {

    console.log('Creating table')
    const data = await DynamoDB.send(new CreateTableCommand(createPortfolioParams))
    console.log('Table Created')
    return data
  } catch (e) {
    console.log('Error: creating table:', e.message)
  }
}

async function createFirstPortfolio () {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      portfolioId: DEFAULT_PORTFOLIO_ID,
    },
    ...generateUpdateQuery({
      names: 'John Patrick'
    })
  }
  const { ...result } = await DynamoDB.send(
    new UpdateCommand(params)
  )
  console.log(`First portfolio created:${result?.$metadata?.httpStatusCode === 200}`)
}

(async function () {
  await createTable()
  await createFirstPortfolio()
}())