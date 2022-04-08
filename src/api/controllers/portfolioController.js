const DbClient = require('../repository/DbClient')
const { getUserByUserName: twUserByUserName } = require('../../common/twitterApi')
const { InvalidRequestError, SystemError } = require('../common/customErrors')

const {
  DIR_TO_SAVE_FILES,
  AWS_ACCESS_KEY_ID: accessKeyId,
  AWS_SECRET_ACCESS_KEY: secretAccessKey
} = process.env

const useS3Client = Boolean(accessKeyId) && Boolean(secretAccessKey)

const fileServerHelper = require('../helpers/fileServerHelper')
const logger = require('../config/logger/logger')

let db = new DbClient()

/**
 * just for testing
 */
function changeDefaultTableName (tableName) {
  db = new DbClient(tableName)
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
  const { files: { imageUrl: file = null } = {}, names, email, experienceSummary, lastNames, twitterUserName } = body
  if (file) {
    const { fileName, ext } = isValidateImageFile(file)
    const wasSaved = await fileServerHelper.saveFileInServer(portfolioId, file, fileName, ext)
    if (!useS3Client && typeof wasSaved !== 'undefined') {
      throw new SystemError(`Error saving file : ${wasSaved.message}`)
    }
    if (portfolio?.imageUrl) {
      await fileServerHelper.deleteFileInServer(portfolio.imageUrl)
    }
    imageUrl = `${DIR_TO_SAVE_FILES}/${portfolioId}-${fileName}.${ext}`
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
    ...(imageUrl && { imageUrl }),
    ...(twitterUserId && { twitterUserId, twitterUser, twitterUserName }),
    ...((!portfolio || (portfolio && !portfolio?.userId)) && twitterUserId && { userId: twitterUserId, }),
  }
  const result = await db.upSertPortfolio(portfolioId, update)
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
  changeDefaultTableName,
  updatePortfolio: upSertPortfolio,
}