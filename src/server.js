// noinspection JSUnresolvedFunction
require('dotenv').config()

const http = require('http')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const path = require('path')

const logger = require('./api/config/logger/logger')
const celebrateMiddleware = require('./api/config/middleware/celebrateMiddleware')
const { printBody } = require('./api/config/middleware/general')
const { SystemError } = require('./api/common/customErrors')

const port = parseInt(process.env.APP_PORT, 10) || 3000
const ENDPOINT = `${process.env.APP_DOMAIN}:${port}`
const publicPath = path.join(__dirname, '../public')
const {
  getFeatureFlagValue,
  features: {
    USE_DYNAMODB
  }
} = require('./api/config/featureFlags')

/**
 * API ROUTES
 */
const twitter = require('./api/routes/v1/twitterRoutes')
const portfolios = require('./api/routes/v1/portfolioRoutes')

const start = async () => {
  try {
    const app = express()
    let server = http.createServer(app)

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(cookieParser())
    app.use(cors())
    app.use(express.static(publicPath))

    /**
     * REGISTERING ROUTES */
    app.use(printBody)
    app.use('/api/v1/twitter', twitter)
    app.use('/api/v1/portfolios', portfolios)

    app.use(celebrateMiddleware)

    if (!getFeatureFlagValue(USE_DYNAMODB)) {
      const mongo = require('./api/common/database/mongo')
      await mongo.init().then(_db => {
        console.log("MONGODB CONNECTION OK");
      }).catch(err => {
        const msg = `MONGODB error:${err.message ? err.message : err}`
        logger.error(msg)
        throw new SystemError(msg)
      })
    }

    server.listen(port, (error) => {
      if (error) throw error
      const msg = `Listening on ${ENDPOINT}`
      logger.info(msg)
      console.log(msg)
    })

    app.on('connection', con => {
      // noinspection JSUnresolvedFunction
      con.setTimeout(30000);
      con.on('close', error => {
        logger.info('HTTP CONNECTION CLOSED');
      });
    });
  } catch (err) {
    console.log("on creating server....", err);
    process.exit(1)
  }
}

start()