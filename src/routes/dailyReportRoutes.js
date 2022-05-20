const { Router } = require('express')
const { dailyReportController } = require('../controllers')
const { checkRole } = require('../middlewares')

const router = new Router()

router.post(
  '/dailyReports/date',
  checkRole(['distributor', 'admin']),
  dailyReportController.createDate
)
router.post(
  '/dailyReports/calculate',
  checkRole(['distributor', 'admin']),
  dailyReportController.calculateDailyReport
)
router.get(
  '/dailyReports',
  checkRole(['distributor', 'admin']),
  dailyReportController.getDailyReports
)
router.get(
  '/dailyReports/summary',
  checkRole(['distributor', 'admin']),
  dailyReportController.getThisMonthStats
)

module.exports = router
