/*
 * Copyright (c) 2022.
 *
 * File wrote it by Cristhian Torres
 * @cristhianDt
 */
const express = require('express')
const router = express.Router()

const twitterController = require('../../controllers/twitterController')
const { errorHandler } = require('../../config/middleware/general')

router.get('/users/:id/tweets', async (req, res) => {
  try {
    const {
      params: { id }
    } = req
    const tweets = await twitterController.getLastNUserTweets(id)
    res.status(200).send({ tweets: tweets?.data })
  } catch (e) {
    errorHandler(res, e)
  }
})

module.exports = router
