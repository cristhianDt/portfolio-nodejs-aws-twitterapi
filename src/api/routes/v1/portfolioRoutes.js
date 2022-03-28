const express = require('express')
const router = express.Router()

const portfolioController = require('../../controllers/portfolioController')
const { errorHandler } = require("../../config/middleware/general");

router.get('/', async (req, res) => {
  try {
    const portfolios = await portfolioController.getPortfolios()
    res.status(200).send(portfolios)
  } catch (e) {
    errorHandler(e)
  }
})

module.exports = router