// noinspection JSUnresolvedVariable
/*
 * Copyright (c) 2022.
 *
 * File wrote it by Cristhian Torres
 * @cristhianDt
 */
const DbClient = require('../repository/DbClient')
const portfolioController = require('./portfolioController')

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

jest.mock('../repository/DbClient')

describe('portfolioController', () => {

  describe('checking: all class was created', () => {
    it('should be able to call new() on DbClient', () => {
      expect(DbClient).toBeTruthy()
    })
  })

  describe('handler Portfolio Test item', () => {

    beforeAll(async () => {
      portfolioController.changeDefaultTableName(TABLE_NAME)
    })

    it('get portfolio by id', async () => {
      const mockDbClient = DbClient.mock.instances[1]
      const expectedResult = {
        portfolioId: DEFAULT_PORTFOLIO_ID,
        name: 'Portfolio Test'
      }
      mockDbClient.getPortfolioById.mockResolvedValue(expectedResult)
      const foundPortfolio = await portfolioController.getById(DEFAULT_PORTFOLIO_ID)
      expect(foundPortfolio).toEqual(expectedResult)
      expect(DbClient).toHaveBeenCalledTimes(2)
    })

    it('update portfolio by id', async () => {
      const mockDbClient = DbClient.mock.instances[1]
      const updates = {
        email: 'test@example.com',
        lastNames: 'Free Willy',
        names: 'Updated Portfolio Test',
        experienceSummary: 'I am bot'
      }
      const expectedResult = {
        portfolioId: DEFAULT_PORTFOLIO_ID,
        name: 'Portfolio Test',
        ...updates
      }
      mockDbClient.upSertPortfolio.mockResolvedValue(expectedResult)
      const updatedPortfolio = await portfolioController.updatePortfolio(DEFAULT_PORTFOLIO_ID, updates)
      expect(updatedPortfolio).toEqual(expectedResult)
      expect(DbClient).toHaveBeenCalledTimes(2)
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })
})
