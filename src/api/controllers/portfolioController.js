const db = require('../repository/portfolioRepository')
const { getUserByUserName: twUserByUserName } = require('../../common/twitterApi')
const { InvalidRequestError, SystemError } = require('../common/customErrors')

const { DIR_TO_SAVE_FILES } = process.env

const fileServerHelper = require('../helpers/fileServerHelper')
const logger = require('../config/logger/logger')

async function getPortfolios() {
  let results = []
  // if (dynamoDBEnabled) {
  /*const command = new ListTablesCommand({})
  results = await dynamoDB.send(command)*/
  // } else {
  /*if (mongo.getCollection?.models?.Portfolio) {
    results = mongo.getCollection.models.Portfolio.find({}).limit(100)
  } else {
    let cursor = await mongo.getCollection.Portfolio.find({}).limit(100)
    await cursor.forEach(portfolio => {
      results.push(portfolio)
    })
  }*/
  // }
  return results
}

/**
 * Using https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_lib_dynamodb.html
 * to get a item
 *
 * @param portfolioId
 * @returns {Promise<*>}
 */
async function getById(portfolioId) {
  let portfolio = {}
  portfolio = await db.getPortfolioById(portfolioId)
  return portfolio
}

async function upSertPortfolio(portfolioId, body) {
  let portfolio = await db.getPortfolioById(portfolioId), imageUrl
  const { files: { imageUrl: file = null }, names, email, experienceSummary, lastNames, twitterUserName } = body
  if (file) {
    const { fileName, ext } = isValidateImageFile(file)
    const wasSaved = await fileServerHelper.saveFileInServer(portfolioId, file, fileName, ext)
    if (typeof wasSaved !== 'undefined') {
      throw new SystemError(`Error saving file : ${wasSaved.message}`)
    }
    if (portfolio?.imageUrl) {
      await fileServerHelper.deleteFileInServer(portfolio.imageUrl)
    }
    imageUrl = `${DIR_TO_SAVE_FILES}/${portfolioId}/${fileName}.${ext}`
  }
  let twitterUserId, twitterUser
  if (twitterUserName && twitterUserName !== portfolio?.twitterUserName) {
    logger.info(`twitterUserName: ${twitterUserName}`);
    ({ data: { id: twitterUserId, name: twitterUser } } = await twUserByUserName(twitterUserName))
  }
  const update = {
    email,
    names,
    experienceSummary,
    lastNames,
    ...(twitterUserId && { userId: twitterUserId, twitterUserId, twitterUser, twitterUserName }),
    ...(imageUrl && { imageUrl })
  }
  const result = await db.client.upSertPortfolio(portfolioId, update)
  return result === 200 ? { ...(portfolio || {}), ...update } : result
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
  getById,
  updatePortfolio: upSertPortfolio,
}