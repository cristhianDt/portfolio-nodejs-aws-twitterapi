// noinspection JSCheckFunctionSignatures

/*
 * Copyright (c) 2022.
 *
 * File wrote it by Cristhian Torres
 * @cristhianDt
 */

// noinspection JSCheckFunctionSignatures

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb')
const logger = require('../../config/logger/logger')

const {
  AWS_ACCESS_KEY_ID: accessKeyId,
  AWS_SECRET_ACCESS_KEY: secretAccessKey,
  AWS_REGION: region,
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
 * @type {DynamoDBClient|DynamoDBClient}
 */
let ddbClient = useAccessKeyAndSecret ? new DynamoDBClient({ region }) : new DynamoDBClient(DEFAULT_LOCAL_CONNECTION)

const marshallOptions = {
  // Whether to automatically convert empty strings, blobs, and sets to `null`.
  convertEmptyValues: false, // false, by default.
  // Whether to remove undefined values while marshalling.
  removeUndefinedValues: true, // false, by default.
  // Whether to convert typeof object to map attribute.
  convertClassInstanceToMap: false, // false, by default.
};

const unmarshallOptions = {
  // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
  wrapNumbers: false, // false, by default.
};

const translateConfig = { marshallOptions, unmarshallOptions };

module.exports = DynamoDBDocumentClient.from(ddbClient /*, translateConfig*/);


