// Required modules
require('dotenv').config()
const express = require('express')
const session = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store)

const passport = require('./src/utils/passport')
const sessionConfig = require('./src/config/sessionsConfig')
const { connectDB, sequelize } = require('./src/utils/database')

const authRoutes = require('./src/routes/authRoutes')
const userRoutes = require('./src/routes/userRoutes')

const app = express()
const port = process.env.PORT || 8000
const sessionStore = new SequelizeStore({
  db: sequelize,
})
sessionStore.sync()

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session(sessionConfig(sessionStore)))
app.use(passport.initialize())
app.use(passport.session())

// Initialize Routes
app.use('/api', authRoutes)
app.use('/api', userRoutes)

// Connecting to DB and starting up the server
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
})

module.exports = app
