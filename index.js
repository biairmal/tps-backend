const dotenv = require('dotenv')
const express = require('express')

dotenv.config()
const app = express()
const port = process.env.PORT || 8000

const connectDB = require('./src/utils/database')

const userRoutes = require('./src/routes/userRoutes')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/api', userRoutes)
app.get('/api', (req, res) => console.log('Test'))

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
})

module.exports = app
