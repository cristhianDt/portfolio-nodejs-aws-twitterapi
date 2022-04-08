// noinspection JSCheckFunctionSignatures

/*
 * Copyright (c) 2022.
 *
 * File wrote it by Cristhian Torres
 * @cristhianDt
 */

// noinspection JSCheckFunctionSignatures

const { S3Client } = require("@aws-sdk/client-s3")
const logger = require('../../config/logger/logger')

const {
  AWS_ACCESS_KEY_ID: accessKeyId,
  AWS_SECRET_ACCESS_KEY: secretAccessKey,
  AWS_REGION: region,
} = process.env


const DEFAULT_CONNECTION = {
  region: region ?? "us-east-1",
}

const useAccessKeyAndSecret = Boolean(accessKeyId) && Boolean(secretAccessKey)
logger.info(`S3Client useAccessKeyAndSecret: ${useAccessKeyAndSecret}`)

module.exports = useAccessKeyAndSecret ? new S3Client({ region }) : new S3Client(DEFAULT_CONNECTION)