const { Router } = require('express')
const { dailyReportController } = require('../controllers')
const { checkRole } = require('../middlewares')

const router = new Router()

router.post(
  '/dailyReports/date',
  dailyReportController.createDate
)
router.post(
  '/dailyReports/calculate',
  dailyReportController.calculateDailyReport
)
router.get(
  '/dailyReports',
  checkRole(['distributor', 'admin', 'dealer']),
  dailyReportController.getDailyReports
)
router.get(
  '/dailyReports/summary',
  checkRole(['distributor', 'admin', 'dealer']),
  dailyReportController.getThisMonthStats
)

module.exports = router
