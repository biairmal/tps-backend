const { DailyReport, SoldItem } = require('../models')
const { parseSequelizeOptions } = require('../helpers')

exports.createDate = async () => {
  const now = new Date()

  const dailyReport = await DailyReport.findOne({ where: { date: now } })

  if (dailyReport) {
    throw new Error('Already exists')
  }

  const newDailyReport = await DailyReport.create({ date: now })

  return newDailyReport
}

exports.getDailyReports = async (query) => {
  const options = parseSequelizeOptions(query)

  return DailyReport.findAll(options)
}

exports.calculateDailyReport = async () => {
  const now = new Date()
  const yesterday = new Date(now - 24 * 60 * 60 * 1000)

  const dailyReport = await DailyReport.findOne({ where: { date: yesterday } })

  if (!dailyReport) return null

  const soldItems = await SoldItem.findAll({
    where: { dateId: dailyReport.id },
  })

  let productsSold = 0
  let grossProfit = 0
  let totalCogs = 0
  let countTransactions = 0
  const transactionsId = []

  soldItems.forEach((item) => {
    if (!transactionsId.includes(item.transactionId)) {
      transactionsId.push(item.transactionId)
      countTransactions += 1
    }
    productsSold += item.quantity
    grossProfit += item.quantity * item.priceATT
    totalCogs += item.quantity * item.cogsATT
  })

  const updatedDailyReport = await dailyReport.update({
    transactions: countTransactions,
    grossProfit,
    soldItems: productsSold,
    totalCogs,
  })

  return updatedDailyReport
}

exports.getThisMonthStats = async () => {}
