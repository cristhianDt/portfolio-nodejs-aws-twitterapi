/*
 * Copyright (c) 2022.
 *
 * File wrote it by Cristhian Torres
 * @cristhianDt
 */
const axios = require('axios')
const { SystemError, InvalidRequestError } = require('../api/common/customErrors')

const MAX_RESULTS = 10
const { TWITTER_BEARER_TOKEN } = process.env

const DEFAULT_USER_FIELDS_TO_GET = ['created_at','description','entities','id','location','name','pinned_tweet_id','profile_image_url','protected','public_metrics','url','username','verified','withheld']

const config = {
  method: 'get',
  headers: {
    'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
  }
}

/**
 * @link https://developer.twitter.com/en/docs/twitter-api/users/lookup/api-reference/get-users-by-username-username#cURL
 *
 * response: {
 *     "data": {
 *         "verified": false,
 *         "public_metrics": {
 *             "followers_count": 0,
 *             "following_count": 5,
 *             "tweet_count": 2,
 *             "listed_count": 0
 *         },
 *         "profile_image_url": "url",
 *         "created_at": "2022-03-29T04:02:02.000Z",
 *         "username": "UserName",
 *         "name": "Name",
 *         "description": "",
 *         "id": "1508655642709483524",
 *         "url": "",
 *         "protected": false
 *     }
 * }
 * @param userName
 * @returns {Promise<void>|Object}
 */
async function getUserByUserName(userName) {
  const url = `https://api.twitter.com/2/users/by/username/${(userName.replace('@', ''))}?user.fields=${DEFAULT_USER_FIELDS_TO_GET.join(',')}`
  const options = {
    url,
  }
  const response = await axios({ ...config, ...options })
  if (response?.data?.errors?.length) {
    throw new InvalidRequestError(`Error: twitter not found`)
  }
  return response.data ?? {}
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
  getUserTweets,
  getUserByUserName
}