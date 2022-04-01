/*
 * Copyright (c) 2022.
 *
 * File wrote it by Cristhian Torres
 * @cristhianDt
 */
const twitterApi = require('../../common/twitterApi')

async function getLastTenTweets(twUserId) {
  return twitterApi.getUserTweets(twUserId, 10)
}

module.exports = {
  getLastTenTweets
}
