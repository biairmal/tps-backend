const dotenv = require('dotenv')
const express = require('express')

dotenv.config()
const app = express()
const port = process.env.PORT || 8000

const connectDB = require('./src/utils/database')

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
})
