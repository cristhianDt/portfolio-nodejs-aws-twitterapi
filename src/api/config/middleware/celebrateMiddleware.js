const { isCelebrate } = require('celebrate')
const { ValidationError } = require('../../common/customErrors')
const { errorHandler } = require('./general')

function celebrateMiddleware(err, req, res, next) {
    if (isCelebrate(err)) {
        const message = err.details.map((d) => d.message)
        const e = new ValidationError(message)
        errorHandler(res, e)
    } else {
        next(err)
    }
}

module.exports = celebrateMiddleware
