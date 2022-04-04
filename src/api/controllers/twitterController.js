/*
 * Copyright (c) 2022.
 *
 * File wrote it by Cristhian Torres
 * @cristhianDt
 */
const twitterApi = require('../../common/twitterApi')

/**
 *
 * @param twUserId
 * @param count
 * @returns {Promise<*|undefined>}
 */
async function getLastNUserTweets(twUserId, count = 5) {
  return twitterApi.getUserTweets(twUserId, count)
}

module.exports = {
  getLastNUserTweets
}
