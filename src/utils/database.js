const { Sequelize } = require('sequelize')

const env = process.env.NODE_ENV || 'development'
const DB = require('../config/database.config')[env]

const sequelize = new Sequelize(DB.name, DB.username, DB.password, {
  dialect: DB.dialect,
  host: DB.host,
  port: DB.port,
  logging: false,
})

module.exports = async function connectDB() {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}
