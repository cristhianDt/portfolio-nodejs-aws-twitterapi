const mongo = require('../config/database/mongo')

async function getPortfolios() {
  let results = []
  if (mongo.getCollection?.models?.Portfolio) {
    results = mongo.getCollection.models.Portfolio.find({}).limit(100)
  } else {
    let cursor = await mongo.getCollection.Portfolio.find({}).limit(100)
    await cursor.forEach(portfolio => {
      results.push(portfolio);
    });
  }
  return results;
}

module.exports = {
  getPortfolios,
}