const { Router } = require('express')
const { dailyReportController } = require('../controllers')

const router = new Router()

router.post('/dailyReports/date', dailyReportController.createDate)
router.post(
  '/dailyReports/calculate',
  dailyReportController.calculateDailyReport
)
router.get('/dailyReports', dailyReportController.getDailyReports)

module.exports = router
