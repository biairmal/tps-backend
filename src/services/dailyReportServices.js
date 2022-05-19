const sequelize = require('sequelize')
const { DailyReport, SoldItem } = require('../models')
const { getCursorData, parseSequelizeOptions } = require('../helpers')

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

  const availableDateGroup = ['day', 'month', 'year']

  let groupDateBy = 'day'

  if (query.groupBy) {
    delete options.where.groupBy
    if (availableDateGroup.includes(query.groupBy.toLowerCase()))
      groupDateBy = query.groupBy
  }

  options.order = [
    [sequelize.fn('date_trunc', groupDateBy, sequelize.col('date')), 'DESC'],
  ]
  options.attributes = [
    [sequelize.fn('date_trunc', groupDateBy, sequelize.col('date')), 'date'],
    [
      sequelize.cast(sequelize.fn('sum', sequelize.col('transactions')), 'int'),
      'transactions',
    ],
    [
      sequelize.cast(sequelize.fn('sum', sequelize.col('soldItems')), 'int'),
      'soldItems',
    ],
    [
      sequelize.cast(sequelize.fn('sum', sequelize.col('totalCogs')), 'float'),
      'totalCogs',
    ],
    [
      sequelize.cast(
        sequelize.fn('sum', sequelize.col('grossProfit')),
        'float'
      ),
      'grossProfit',
    ],
  ]
  options.group = [
    sequelize.fn('date_trunc', groupDateBy, sequelize.col('date')),
  ]

  const dailyReports = await DailyReport.findAll(options)
  const cursor = await getCursorData(DailyReport, query, {
    group: [sequelize.fn('date_trunc', groupDateBy, sequelize.col('date'))],
  })

  const data = {
    edge: dailyReports,
    cursor,
  }

  return data
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
