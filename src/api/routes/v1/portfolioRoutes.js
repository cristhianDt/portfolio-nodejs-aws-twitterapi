const express = require('express')
const router = express.Router()

const portfolioController = require('../../controllers/portfolioController')
const { errorHandler } = require('../../config/middleware/general')
const parseFilesMiddleware = require('../../config/middleware/parseFilesMiddleware')

router.get('/', async (req, res) => {
  try {
    const portfolios = await portfolioController.getPortfolios()
    res.status(200).send(portfolios)
  } catch (e) {
    errorHandler(res, e)
  }
})

router.get('/:portfolioId', async (req, res) => {
  try {
    const {
      params: { portfolioId }
    } = req
    const portfolio = await portfolioController.getById(parseInt(portfolioId))
    res.status(200).send({ portfolio })
  } catch (e) {
    errorHandler(res, e)
  }
})

router.post('/:id', parseFilesMiddleware, async (req, res) => {
  try {
    const {
      body,
      params: { id }
    } = req
    const updatedPortfolio = await portfolioController.updatePortfolio(id, body)
    res.status(200).send({ portfolio: updatedPortfolio })
  } catch (e) {
    errorHandler(res, e)
  }
})

module.exports = router