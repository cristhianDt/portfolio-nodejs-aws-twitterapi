// noinspection JSVoidFunctionReturnValueUsed

/*
 * Copyright (c) 2022.
 *
 * File wrote it by Cristhian Torres
 * @cristhianDt
 */
const logger = require('../config/logger/logger')
const fs = require('fs')
const path = require('path')
const putObject = require('../common/S3/putObject')
const deleteObject = require('../common/S3/deleteObject')

const {
  DIR_TO_SAVE_FILES,
  AWS_S3_PUBLIC_BUCKET,
  AWS_ACCESS_KEY_ID: accessKeyId,
  AWS_SECRET_ACCESS_KEY: secretAccessKey
} = process.env

const useS3Client = Boolean(accessKeyId) && Boolean(secretAccessKey)
const folderToSaveFiles = (savedFilePath) => path.join(__dirname, `../../../public/${savedFilePath ?? DIR_TO_SAVE_FILES}`)

/**
 * @param portfolioId
 * @param file FileServer entity
 * @param name file name without extension
 * @param ext
 * @returns {*}
 */
exports.saveFileInServer = async (portfolioId, file, name, ext) => {
  if (useS3Client) {
    const oldPath = file.path ?? file.filepath
    const body = fs.createReadStream(oldPath)
    const key = `${DIR_TO_SAVE_FILES}/${portfolioId}-${name}.${ext}`
    const result = await putObject({
      bucket: AWS_S3_PUBLIC_BUCKET,
      key,
      body,
    })
  
    logger.info(`finished uploading :: ${key} to S3`)
  
    return result
  } else {
    const diskPath = `${folderToSaveFiles()}/${portfolioId}`
    if (!fs.existsSync(diskPath)) {
      fs.mkdirSync(diskPath, { recursive: false })
      logger.info(`created directory: ${diskPath}`)
    }
    const newPath = `${diskPath}/${name}.${ext}`
    const oldPath = file.path ?? file.filepath
    fs.copyFileSync(oldPath, newPath)
    logger.info('File written in disk: ' + newPath)
    fs.unlink(oldPath, function (err) {
      if (err) {
        throw err
      } else {
        logger.info('Deleted file in temp folder: ' + oldPath)
        return 'ok'
      }
    })
  }
}

/**
 *
 * @param path String where is the file located in the server
 * @returns {Promise<void>}
 */
exports.deleteFileInServer = async (path) => {
  if (useS3Client) {
    const result = await putObject({
      bucket: AWS_S3_PUBLIC_BUCKET,
      key: path,
    })
  
    logger.info(`finished deleting :: ${path} in S3:: ${AWS_S3_PUBLIC_BUCKET}`)
  
    return result
  } else {
    path = folderToSaveFiles(path)
    return new Promise(async (resolve, reject) => {
      fs.access(path, fs.constants.F_OK, (error) => {
        if (error) {
          /* file does not exist */
          logger.error(error)
          reject(error.message || 'error access to delete file from disk ')
        } else {
          fs.unlink(path, function (error) {
            if (error) {
              reject(error.message || 'error deleting file from disk')
            } else {
              logger.info('Deleted file from disk: ' + path)
              resolve('ok')
            }
          })
        }
      })
    })
  }
}
