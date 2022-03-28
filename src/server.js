// noinspection JSUnresolvedFunction
require('dotenv').config()

const http = require('http')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const path = require('path')

const port = parseInt(process.env.APP_PORT, 10) || 3000
const ENDPOINT = `${process.env.APP_DOMAIN}:${port}`
const publicPath = path.join(__dirname, '../public')

const logger = require('./api/config/logger/logger')
const celebrateMiddleware = require('./api/config/middleware/celebrateMiddleware')

/**
 * API ROUTES
 */
// TODO: declare routes here

const app = express()
let server = http.createServer(app)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors())
app.use(express.static(publicPath))

/**
 * REGISTERING ROUTES */
// TODO: register routes here

app.use(celebrateMiddleware)

server.listen(port, (error) => {
    if(error) throw error
    const msg = `Listening on ${ENDPOINT}`
    logger.info(msg)
    console.log(msg)
})
