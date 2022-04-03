const fs = require('fs')
const path = require('path')

const models = fs.readdirSync(path.join(__dirname, '../models'))
const schemas = models.map((file) => file.slice(0, file.indexOf('.'))).reduce((schema, file) => {
  schema[file] = require(`../models/${file}`)
  return schema
}, {})

module.exports = schemas