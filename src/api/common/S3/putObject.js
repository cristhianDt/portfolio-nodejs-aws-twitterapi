/*
 * Copyright (c) 2022.
 *
 * File wrote it by Cristhian Torres
 * @cristhianDt
 */
const s3Client = require('./s3')
const { PutObjectCommand } = require('@aws-sdk/client-s3')
const { SystemError } = require('../customErrors')

/*
const fileStream = fs.createReadStream(file)

/**
 * 
 * @param {Object} body: file binay (fileStream), bucket: BucketName, key: path eg 'folderName/fileName.ext' 
 * @returns 
 */
module.exports = async ({ body, bucket, key }) => {
  /**
   * {
    Bucket: "BUCKET_NAME",
    // Add the required 'Key' parameter using the 'path' module.
    Key: path.basename(file),
    // Add the required 'Body' parameter
    Body: fileStream,
  }
   */
  const uploadParams = {
    Body: body,
    Bucket: bucket,
    Key: key,
  }

  try {
    const data = await s3Client.send(new PutObjectCommand(uploadParams))
    console.log("Success", data)
    return data
  } catch (err) {
    const m = `Error while putting Object`
    throw new SystemError(err, m)
  }
}
