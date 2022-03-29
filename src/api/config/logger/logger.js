const winston = require('winston')
const { format } = winston
const { combine, colorize, prettyPrint, timestamp, printf } = format

const logLevel = 'info'

function customLogMessage(info) {
  const { timestamp, level, message, ...rest } = info
  const baseMessage = `${timestamp} ${level}: ${message}`
  return Object.keys(rest).length <= 0 ? baseMessage : `${baseMessage} ${JSON.stringify(rest)}`
}

function customJsonLogMessage(info) {
  return JSON.stringify({ ...info })
}

let loggerConfig = {
  transports: [
    new winston.transports.Console({
      level: logLevel,
      handleExceptions: true,
      format: combine(colorize(), prettyPrint(), timestamp(), printf(customLogMessage)),
    }),
    new winston.transports.File({ /*level: 'error', */filename: './logs/portfolio-errors.log' }),
  ],
}

let logger = winston.createLogger(loggerConfig)

module.exports = logger