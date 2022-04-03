/*
 * Copyright (c) 2022.
 *
 * File wrote it by Cristhian Torres
 * @cristhianDt
 */
const DbInterface = require('./DbInterface')
const mongo = require('../../common/database/mongo')
const mongodbUtils = require('../../../utils/mongodb')
const { ObjectId } = require('mongodb')

// should implement the DbInterface methods
class MongoDbClient extends DbInterface {
  constructor(shouldUseMongoose) {
    super()
    this.useMongoose = shouldUseMongoose
  }

  async getPortfolioById(portfolioId) {
    let portfolio
    if (!mongodbUtils.isValidObjectId(portfolioId)) {
      return this.getByUserId(portfolioId)
    }
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
      results = await mongo.getCollection.models.Portfolio.find({}).limit(100)
    } else {
      let cursor = await mongo.getCollection.Portfolio.find({}).limit(100)
      await cursor.forEach(portfolio => {
        results.push(portfolio)
      })
    }
    return results
  }

  async upSertPortfolio(id, update) {
    if (this.useMongoose) {
      // if mongoose is enabled
      const result = await mongo.getCollection.models.Portfolio.findOneAndUpdate({ ...(!mongodbUtils.isValidObjectId(id) && { userId: id } || { _id: new ObjectId(id) }) }, update, {
        new: true,
        upsert: true,
        rawResult: true, // Return the raw result from the MongoDB driver
        returnOriginal: false,
      })
      return result?.ok && result.value
    } else {
      // if mongoose is disabled
      console.log({ ...(!mongodbUtils.isValidObjectId(id) && { userId: id } || { _id: new ObjectId(id) }) })
      const options = { upsert: true }
      const result = await mongo.getCollection.Portfolio.updateOne({ ...(!mongodbUtils.isValidObjectId(id) && { userId: id } || { _id: new ObjectId(id) }) }, { $set: update }, options)
      return result.modifiedCount && 200
    }
  }

  async getByUserId(userId) {
    let portfolio = {}
    if (this.useMongoose) {
      portfolio = await mongo.getCollection.models.Portfolio.findOne({ userId })
    } else {
      portfolio = await mongo.getCollection.Portfolio.findOne({ userId })
    }
    return portfolio
  }
}

module.exports = MongoDbClient