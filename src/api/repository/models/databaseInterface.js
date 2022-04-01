/*
 * Copyright (c) 2022.
 *
 * File wrote it by Cristhian Torres
 * @cristhianDt
 */

class DbInterface {
  constructor() {
  }
  getPortfolioById () { /* should return */ }
  getPortfolios () { /*should return all the portfolios*/ }
  getByUserId () { /* should return the first portfolio by user */ }
  updatePortfolio () { /* should update portfolio */ }
}

module.exports = DbInterface