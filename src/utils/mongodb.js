const logger = require('../api/config/logger/logger')
const ObjectId = require('mongodb').ObjectId;

exports.generateObjectId = (hexString) => {
  try {
    return new ObjectId(hexString);
  } catch (e) {
    return null;
  }
}

exports.isValidObjectId = (hexString) => {
  try {
    return ObjectId.isValid(hexString);
  } catch (e) {
    logger.error(`Invalid mongo Object Id`, e)
    return null;
  }
}