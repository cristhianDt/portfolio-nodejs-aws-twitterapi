/*
 * Copyright (c) 2022.
 *
 * File wrote it by Cristhian Torres
 * @cristhianDt
 */

class DbInterface {
  constructor() {
  }
  getPortfolioById (portfolioId) { /* should return */ }
  getPortfolios () { /*should return all the portfolios*/ }
  getByUserId (userId) { /* should return the first portfolio by user */ }
  upSertPortfolio (portfolioId, update) { /* should update portfolio */ }
}

module.exports = DbInterface