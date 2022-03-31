// noinspection JSCheckFunctionSignatures

/*
 * Copyright (c) 2022.
 *
 * File wrote it by Cristhian Torres
 * @cristhianDt
 */
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const logger = require('../../config/logger/logger')

const {
  DYNAMODB_AWS_ACCESS_KEY_ID: accessKeyId,
  DYNAMODB_AWS_SECRET_ACCESS_KEY: secretAccessKey,
  DYNAMODB_AWS_REGION: region,
} = process.env

/**
 * AWS config options (v3 use same v2 options)
 *
 * @link https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#constructor-property
 * @link https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#constructor-property
 * @type {{endpoint: string, region: (string|string)}}
 */
const DEFAULT_LOCAL_CONNECTION = {
  region: region ?? "us-east-1",
  endpoint: "http://localhost:8000"
}

const useAccessKeyAndSecret = Boolean(accessKeyId) && Boolean(secretAccessKey)
logger.info(`DynamoDB useAccessKeyAndSecret: ${useAccessKeyAndSecret}`)

/**
 * use DynamoDBClient instead DynamoDB
 *
 * @link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/
 * @link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/classes/dynamodb.html
 * @link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/classes/dynamodbclient.html
 * @type {AWS.DynamoDBClient}
 */
module.exports = useAccessKeyAndSecret ? new DynamoDBClient({ accessKeyId, secretAccessKey, region }) : new DynamoDBClient(DEFAULT_LOCAL_CONNECTION)

