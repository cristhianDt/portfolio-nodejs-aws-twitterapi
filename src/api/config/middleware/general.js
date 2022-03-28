const isEmpty = require('lodash/isEmpty')
const logger = require('../logger/logger')

exports.printBody = (req, res, next) => {
  const { method, path, query, body } = req
  logger.info(`Req ${method} ${path}`, {
    request: {
      path,
      method,
      ...(!isEmpty(body) && { body }),
      ...(!isEmpty(query) && { query })
    }
  })
  res.on('finish', function () {
    let {  statusCode, req: { method, query, body, originalUrl } } = this
    logger.info(`Res to ${method}`, {
      request: {
        originalUrl,
        method,
        statusCode,
        ...(!isEmpty(body) && { body }),
        ...(!isEmpty(query) && { query })
      }
    })
  })
  next()
}

exports.errorHandler = (error, req, res, next) => {
  const errorObj = {
    type: error.name,
    message: error.message,
    status: error.status ? error.status : 500,
    context: error.context,
  }

  if (errorObj.status >= 500) {
    logger.error(`${error.message} :: ${error.context}\n${error.stack}`)
  } else {
    logger.warn(error.message)
  }

  return res.status(errorObj.status).send(errorObj)
}

exports.handleResponse = (req, res, next) => {
  res.status(res.locals.result.status).json({ status: 'OK', data: res.locals.result.body })
}