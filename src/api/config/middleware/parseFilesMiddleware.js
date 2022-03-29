/*
 * Copyright (c) 2022.
 *
 * File wrote it by Cristhian Torres
 * @cristhianDt
 */
const formidable = require('formidable')
const logger = require('../logger/logger')
const { SystemError } = require('../../common/customErrors')

module.exports = (req, res, next) => {
  const form = new formidable.IncomingForm()
  form.parse(req, function (err, fields, files) {
    if (err) {
      const msg = `Formidable error:${err.message ? err.message : err}`
      logger.error(msg)
      throw new SystemError('Error saving file')
    } else {
      req.body = {
        ...fields,
        ...{ files }
      }
      logger.info('Req parsed ', req.body)
      next()
    }
  })
}