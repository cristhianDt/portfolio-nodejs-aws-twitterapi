/*
 * Copyright (c) 2022.
 *
 * File wrote it by Cristhian Torres
 * @cristhianDt
 */
// noinspection JSUnresolvedVariable

const DynamoDB = require('./DynamoDB')
const { generateUpdateQuery } = require('../../repository/models/DynamoDbClient')
const { CreateTableCommand, DeleteTableCommand, PutItemCommand } = require('@aws-sdk/client-dynamodb')
const { UpdateCommand, GetCommand } = require('@aws-sdk/lib-dynamodb')

const TABLE_NAME = 'Tests-Table'
const DEFAULT_PORTFOLIO_ID = 0

const createTestTableParams = {
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

describe('portfolioController', () => {

  beforeAll(async () => {
    // console.log('Creating table')
    const data = await DynamoDB.send(new CreateTableCommand(createTestTableParams))
    // console.log('Table Created')
    return data
  })

  describe('checking: all class was created', () => {
    it('should be able to call new() on DynamoDB', () => {
      expect(DynamoDB).toBeTruthy()
    })
  })

  describe('handler Portfolio Test item', () => {
    const updates = {
      email: 'test@example.com',
      lastNames: 'Free Willy',
      names: 'Portfolio Test',
      experienceSummary: 'I am bot'
    }
    const updatedPortfolio = {
      portfolioId: DEFAULT_PORTFOLIO_ID,
      ...updates
    }

    it('default test portfolio does not exist yet', async () => {
      const params = {
        TableName: TABLE_NAME,
        Key: {
          portfolioId: DEFAULT_PORTFOLIO_ID,
        },
      }
      let { Item: foundPortfolio } = await DynamoDB.send(new GetCommand(params))
      expect(foundPortfolio).toEqual(undefined)
    })

    it('create portfolio by id', async () => {
      const params = {
        TableName: TABLE_NAME,
        Key: {
          portfolioId: DEFAULT_PORTFOLIO_ID,
        },
        ...generateUpdateQuery({
          names: 'Portfolio Test'
        })
      }
      const { ...result } = await DynamoDB.send(
        new UpdateCommand(params)
      )
      expect(result?.$metadata?.httpStatusCode).toEqual(200)
    })

    it('update portfolio by id', async () => {
      const params = {
        TableName: TABLE_NAME,
        Key: {
          portfolioId: DEFAULT_PORTFOLIO_ID,
        },
        ...generateUpdateQuery(updates)
      }
      const { ...result } = await DynamoDB.send(
        new UpdateCommand(params)
      )
      expect(result?.$metadata?.httpStatusCode).toEqual(200)
    })

    it('get updated test portfolio', async () => {
      const params = {
        TableName: TABLE_NAME,
        Key: {
          portfolioId: DEFAULT_PORTFOLIO_ID,
        },
      }
      let { Item: foundPortfolio } = await DynamoDB.send(new GetCommand(params))
      expect(foundPortfolio).toEqual(updatedPortfolio)
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    const data = await DynamoDB.send(new DeleteTableCommand({
      TableName: 'Tests-Table',
    }))
    // console.log('Success, table deleted')
    return data
  })
})
