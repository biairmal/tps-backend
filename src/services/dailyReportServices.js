const { DailyReport, SoldItem } = require('../models')

exports.createDate = async () => {
  const now = new Date()

  const dailyReport = await DailyReport.findOne({ where: { date: now } })

  if (dailyReport) {
    throw new Error('Already exists')
  }

  const newDailyReport = await DailyReport.create({ date: now })
  return newDailyReport
}

exports.calculateDailyReport = async () => {
  const now = new Date()
  const yesterday = new Date(now - 24 * 60 * 60 * 1000)
  const dailyReport = await DailyReport.findOne({ where: { date: yesterday } })

  if (!dailyReport) return 0

  const soldItems = await SoldItem.findAll({
    where: { dateId: dailyReport.id },
  })
  const soldItemsPromise = soldItems.map(async (soldItem) => {
    let info = await soldItem.getItem()
    info = info.toJSON()
    const itemInfo = { ...info, ...{ quantity: soldItem.quantity } }
    return itemInfo
  })

  const resolvedPromises = await Promise.all(soldItemsPromise)
  let productsSold = 0
  let grossProfit = 0
  let totalCogs = 0
  resolvedPromises.forEach((item) => {
    productsSold += item.quantity
    // INI HARUS SESUAI HARGA SIAPA YANG BELI
    grossProfit += item.normalPrice
    totalCogs += item.cogs
  })
  const countTransactions = new Set(resolvedPromises).size

  const updatedDailyReport = await dailyReport.update({
    transactions: countTransactions,
    grossProfit,
    soldItems: productsSold,
    totalCogs,
  })
  return updatedDailyReport
}

exports.getDailyReports = async () => {
  const data = await DailyReport.findAll({})

  return data
}

exports.getThisMonthStats = async () => {}
