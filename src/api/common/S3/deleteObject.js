/*
 * Copyright (c) 2022.
 *
 * File wrote it by Cristhian Torres
 * @cristhianDt
 */
const s3Client = require('./s3')
const { DeleteObjectCommand } = require('@aws-sdk/client-s3')
const { SystemError } = require('../customErrors')

/**
 * 
 * @param {Object} bucket: BucketName, key: path eg 'folderName/fileName.ext' 
 * @returns 
 */
module.exports = async ({ bucket, key }) => {
  /**
   * {
    Bucket: "BUCKET_NAME",
    // Add the required 'Key' parameter using the 'path' module.
    Key: path.basename(file),
  }
   */
  const params = {
    Bucket: bucket,
    Key: key,
  }

  try {
    const data = await s3Client.send(new DeleteObjectCommand(params))
    console.log("Success: Object deleted::", data)
    return data
  } catch (err) {
    const m = `Error while deletting Object`
    throw new SystemError(err, m)
  }
}
