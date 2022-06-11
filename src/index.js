// Required modules
require('dotenv').config()
const cors = require('cors')
const express = require('express')
const session = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const { CronJob } = require('cron')
const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')

const passport = require('./utils/passport')
const sessionConfig = require('./config/sessionsConfig')
const { connectDB, sequelize } = require('./utils/database')

const routes = require('./routes')

const app = express()
const httpPort = process.env.HTTP_PORT || 8080
const httpsPort = process.env.HTTPS_PORT || 8443
const privateKey = fs.readFileSync(path.join(__dirname, '../cert/key.pem'))
const certificate = fs.readFileSync(path.join(__dirname, '../cert/cert.pem'))
const sessionStore = new SequelizeStore({
  db: sequelize,
})
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true, // access-control-allow-credentials:true
  allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie'],
  optionSuccessStatus: 200,
}
const sslOptions = {
  key: privateKey,
  cert: certificate,
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

const httpServer = http.createServer(app)
const httpsServer = https.createServer(sslOptions, app)

createDailyReport.start()
calculateDailyReport.start()
// Connecting to DB and starting up the server
connectDB().then(async () => {
  await httpServer.listen(httpPort)
  await httpsServer.listen(httpsPort)
  console.log(`Server is up and running on port ${httpPort} & ${httpsPort}`)
})

module.exports = app
