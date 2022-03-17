/* eslint-disable import/no-dynamic-require */
const Sequelize = require('sequelize')

const env = process.env.NODE_ENV || 'development'
const config = require(`${__dirname}/../config/database.config.js`)[env]
const initModels = require('./init-models')

let sequelize
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], {
    dialect: config.dialect,
    logging: false,
  })
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    dialect: config.dialect,
    logging: false,
  })
}

const models = initModels(sequelize)

module.exports = models
