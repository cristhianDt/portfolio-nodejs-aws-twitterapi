const mongo = require('../config/database/mongo')
const { InvalidRequestError, SystemError } = require('../common/customErrors')
const fileServerHelper = require('../helpers/fileServerHelper')
const {
  getFeatureFlagValue,
  features: { USE_MONGOOSE }
} = require('../config/featureFlags')
const shouldUseMongoose = getFeatureFlagValue(USE_MONGOOSE)

const { DIR_TO_SAVE_FILES } = process.env

async function getPortfolios() {
  let results = []
  if (mongo.getCollection?.models?.Portfolio) {
    results = mongo.getCollection.models.Portfolio.find({}).limit(100)
  } else {
    let cursor = await mongo.getCollection.Portfolio.find({}).limit(100)
    await cursor.forEach(portfolio => {
      results.push(portfolio)
    })
  }
  return results
}

async function getByUserId(userId) {
  let portfolio = {}
  if (mongo.getCollection?.models?.Portfolio) {
    portfolio = mongo.getCollection.models.Portfolio.findOne({ userId })
  } else {
    portfolio = await mongo.getCollection.Portfolio.findOne({ userId })
  }
  return portfolio
}

async function updatePortfolio(portfolioId, body) {
  let portfolio, imageUrl
  const { files: { imageUrl: file = null }, names, experienceSummary, lastNames } = body
  if (mongo.getCollection?.models?.Portfolio) {
    portfolio = await mongo.getCollection.models.Portfolio.findOne({ _id: mongo.ObjectId(portfolioId) })
  } else {
    portfolio = await mongo.getCollection.Portfolio.findOne({ _id: mongo.ObjectId(portfolioId) })
  }
  if (!portfolio) {
    throw new InvalidRequestError(`Portfolio not found ${portfolioId}`)
  }
  if (file) {
    const { fileName, ext } = isValidateImageFile(file)
    const wasSaved = await fileServerHelper.saveFileInServer(portfolioId, file, fileName, ext)
    if (typeof wasSaved !== 'undefined') {
      throw new SystemError(`Error saving file : ${wasSaved.message}`)
    }
    if (portfolio.imageUrl) {
      await fileServerHelper.deleteFileInServer(portfolio.imageUrl)
    }
    imageUrl = `${DIR_TO_SAVE_FILES}/${portfolioId}/${fileName}.${ext}`
  }
  const update = {
    names,
    experienceSummary,
    lastNames,
    ...(imageUrl && { imageUrl })
  }
  if (shouldUseMongoose) {
    // if mongoose is enabled
    return mongo.getCollection.models.Portfolio.findOneAndUpdate({ _id: portfolio._id }, update, {
      returnOriginal: false,
    })
  } else {
    // if mongoose is disabled
    const result = await mongo.getCollection.Portfolio.updateOne({ _id: portfolio._id }, { $set: update })
    return result.modifiedCount ? update : {}
  }
}

function isValidateImageFile(file) {
  let fileName = file.name || file.originalFilename
  const indexOfLastPeriod = fileName.lastIndexOf('.')
  const fileExtension = fileName.substring(indexOfLastPeriod + 1, fileName.length)
  const isValExt = fileExtension.match(/(jpg|jpeg|png|heic)$/i)
  if (null === isValExt || (0 === isValExt.length)) {
    throw new InvalidRequestError(`Try to save file with wrong mime type: ${fileExtension}`)
  }
  fileName = fileName.substring(0, indexOfLastPeriod)
  return { fileName, ext: fileExtension }
}

module.exports = {
  getPortfolios,
  getByUserId,
  updatePortfolio,
}