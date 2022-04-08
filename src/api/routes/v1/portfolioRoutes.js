// noinspection JSCheckFunctionSignatures

const express = require('express')
const router = express.Router()

const portfolioController = require('../../controllers/portfolioController')
const { errorHandler } = require('../../config/middleware/general')
const parseFilesMiddleware = require('../../config/middleware/parseFilesMiddleware')
const {
  validateUpSertPortfolioRequestSchema
} = require('./portfolioRoutesValidator')
const {
  AWS_REGION,
  AWS_S3_PUBLIC_BUCKET,
  AWS_ACCESS_KEY_ID: accessKeyId,
  AWS_SECRET_ACCESS_KEY: secretAccessKey
} = process.env

const useS3Client = Boolean(accessKeyId) && Boolean(secretAccessKey)
bucket = useS3Client ? `https://${AWS_S3_PUBLIC_BUCKET}.s3.${AWS_REGION ?? 'us-east-1'}.amazonaws.com` : undefined

/*router.get('/', async (req, res) => {
  try {
    const portfolios = await portfolioController.getPortfolios()
    res.status(200).send(portfolios)
  } catch (e) {
    errorHandler(res, e)
  }
})*/

router.get('/:portfolioId', async (req, res) => {
  try {
    const {
      params: { portfolioId }
    } = req
    const portfolio = await portfolioController.getById(portfolioId)
    res.status(200).send({
      portfolio,
      ...(useS3Client && { bucket })
    })
  } catch (e) {
    errorHandler(res, e)
  }
})

router.post('/:id', parseFilesMiddleware, validateUpSertPortfolioRequestSchema, async (req, res) => {
  try {
    const {
      body, params: { id }
    } = req
    const updatedPortfolio = await portfolioController.updatePortfolio(id, body)
    res.status(200).send({
      portfolio: updatedPortfolio,
      ...(useS3Client && { bucket })
   })
  } catch (e) {
    errorHandler(res, e)
  }
})

module.exports = router