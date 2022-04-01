/*
 * Copyright (c) 2022.
 *
 * File wrote it by Cristhian Torres
 * @cristhianDt
 */
const DbInterface = require('./databaseInterface')
const mongo = require('../../common/database/mongo')

// should implement the DbInterface methods
class mongoDbClient extends DbInterface {
  constructor(shouldUseMongoose) {
    super()
    this.useMongoose = shouldUseMongoose
  }

  async getPortfolioById(portfolioId) {
    let portfolio
    if (this.useMongoose) {
      portfolio = await mongo.getCollection.models.Portfolio.findOne({ _id: mongo.ObjectId(portfolioId) })
    } else {
      portfolio = await mongo.getCollection.Portfolio.findOne({ _id: mongo.ObjectId(portfolioId) })
    }
    return portfolio
  }

  async getPortfolios() {
    let results = []
    if (this.useMongoose) {
      results = mongo.getCollection.models.Portfolio.find({}).limit(100)
    } else {
      let cursor = await mongo.getCollection.Portfolio.find({}).limit(100)
      await cursor.forEach(portfolio => {
        results.push(portfolio)
      })
    }
    return results
  }

  async updatePortfolio(update) {
    if (this.useMongoose) {
      // if mongoose is enabled
      return mongo.getCollection.models.Portfolio.findOneAndUpdate({ _id: portfolio._id }, update, {
        returnOriginal: false,
      })
    } else {
      // if mongoose is disabled
      const result = await mongo.getCollection.Portfolio.updateOne({ _id: portfolio._id }, { $set: update })
      return result.modifiedCount
    }
  }

  async getByUserId(userId) {
    let portfolio = {}
    if (this.useMongoose) {
      portfolio = mongo.getCollection.models.Portfolio.findOne({ userId })
    } else {
      portfolio = await mongo.getCollection.Portfolio.findOne({ userId })
    }
    return portfolio
  }
}

module.exports = mongoDbClient