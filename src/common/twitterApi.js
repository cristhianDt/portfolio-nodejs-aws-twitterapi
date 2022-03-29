/*
 * Copyright (c) 2022.
 *
 * File wrote it by Cristhian Torres
 * @cristhianDt
 */
const axios = require('axios')
const { SystemError } = require('../api/common/customErrors')

const MAX_RESULTS = 10
const { TWITTER_BEARER_TOKEN } = process.env

const config = {
  method: 'get',
  headers: {
    'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
  }
}

async function getUserTweets(twUserId, maxResults) {
  try {
    const options = {
      url: `https://api.twitter.com/2/users/${twUserId}/tweets?expansions=attachments.media_keys,referenced_tweets.id,author_id&tweet.fields=attachments,author_id,created_at,public_metrics,source&media.fields=public_metrics,duration_ms&max_results=${maxResults ?? MAX_RESULTS}`
    }
    const response = await axios({ ...config, ...options })
    return response?.data ?? []
  } catch (error) {
    throw new SystemError(`Error getting user tweets : ${error.message}`)
  }
}

module.exports = {
  getUserTweets
}