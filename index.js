const express = require('express')
const dotenv = require('dotenv')

const app = express()
dotenv.config()

const port = process.env.PORT || 8000

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

const { Sequelize } = require('sequelize')
const DB = require('./src/config/dabase.config')

const sequelize = new Sequelize(DB.name, DB.username, DB.password, {
  dialect: DB.dialect,
  host: DB.host,
  port: DB.port,
})

async function connectDB() {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

connectDB()
