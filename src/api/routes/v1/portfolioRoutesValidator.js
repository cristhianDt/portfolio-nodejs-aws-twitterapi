/*
 * Copyright (c) 2022.
 *
 * File wrote it by Cristhian Torres
 * @cristhianDt
 */
const { celebrate, Joi } = require('celebrate')

const validateGetPortfolioByIdSchema = celebrate({
  params: {
    portfolioId: Joi.alternatives(Joi.number(), Joi.string()).required()
  }
})

const validateUpSerPortfolioParamsSchema = celebrate({
  params: {
    id: Joi.alternatives(Joi.number(), Joi.string()).required()
  }
})

const upSertPortfolioSchema = Joi.object({
  email: Joi.string().required(),
  names: Joi.string().required(),
  lastNames: Joi.string().required(),
  files: {
    imageUrl:
      {
        size: Joi.number(),
        filepath: Joi.string(),
        originalFilename: Joi.string()
      }
  },
  twitterUserName: Joi.string(),
  experienceSummary: Joi.string()
}).unknown(false)

const validateUpSertPortfolioRequestSchema = celebrate({ body: upSertPortfolioSchema })
const validateUpSertPortfolioBody = (body) => Joi.validate(body, upSertPortfolioSchema)

module.exports = {
  validateGetPortfolioByIdSchema,
  validateUpSerPortfolioParamsSchema,
  validateUpSertPortfolioBody,
  validateUpSertPortfolioRequestSchema
}