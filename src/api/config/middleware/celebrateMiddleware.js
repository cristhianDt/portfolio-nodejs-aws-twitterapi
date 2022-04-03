const { isCelebrateError } = require('celebrate')
const { ValidationError } = require('../../common/customErrors')
const { errorHandler } = require('./general')

function celebrateMiddleware(err, req, res, next) {
  if (isCelebrateError(err)) {
    const [ error ] = err.details?.values()
    const e = new ValidationError(error?.message)
    errorHandler(res, e)
  } else {
    next(err)
  }
}

module.exports = celebrateMiddleware
