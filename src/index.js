// Required modules
require('dotenv').config()
const cors = require('cors')
const express = require('express')
const session = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const { CronJob } = require('cron')

const passport = require('./utils/passport')
const sessionConfig = require('./config/sessionsConfig')
const { connectDB, sequelize } = require('./utils/database')

const routes = require('./routes')

const app = express()
const port = process.env.PORT || 8000
const sessionStore = new SequelizeStore({
  db: sequelize,
})
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true, // access-control-allow-credentials:true
  optionSuccessStatus: 200,
}
sessionStore.sync()

// Middleware
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session(sessionConfig(sessionStore)))
app.use(passport.initialize())
app.use(passport.session())

// Initialize Routes
Object.keys(routes).forEach((route) => {
  app.use('/api', routes[route])
})

// Initialize Scheduled Task
const { dailyReportServices } = require('./services')

const createDailyReport = new CronJob(
  '0 0 * * *',
  dailyReportServices.createDate,
  null,
  true,
  'Asia/Jakarta'
)
const calculateDailyReport = new CronJob(
  '0 0 * * *',
  dailyReportServices.calculateDailyReport,
  null,
  true,
  'Asia/Jakarta'
)

createDailyReport.start()
calculateDailyReport.start()
// Connecting to DB and starting up the server
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
})

module.exports = app
