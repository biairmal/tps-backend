/* eslint-disable no-unused-vars */
const getDaysArray = (start, end) => {
  const array = []
  for (
    let date = new Date(start);
    date <= new Date(end);
    date.setDate(date.getDate() + 1)
  ) {
    array.push(new Date(date))
  }
  return array
}

const dataFaker = () => {
  const transactionsOpt = [1, 2, 3, 4, 5]
  const soldItemsOpt = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const grossProfitOpt = [11000, 120000, 130000, 140000, 150000, 160000]
  const totalCogsOpt = [50000, 60000, 70000, 80000, 90000, 100000]

  const transactions =
    transactionsOpt[Math.floor(Math.random() * transactionsOpt.length)]
  const soldItems =
    soldItemsOpt[Math.floor(Math.random() * soldItemsOpt.length)]
  const grossProfit =
    grossProfitOpt[Math.floor(Math.random() * grossProfitOpt.length)]
  const totalCogs =
    totalCogsOpt[Math.floor(Math.random() * totalCogsOpt.length)]

  return { transactions, soldItems, grossProfit, totalCogs }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const nowDate = new Date()
    const startDate = new Date(new Date().setMonth(nowDate.getMonth() - 24))

    const dateArray = getDaysArray(startDate, nowDate)
    const now = new Date()

    const data = dateArray.map((date) => {
      const { transactions, soldItems, grossProfit, totalCogs } = dataFaker()
      return {
        date,
        transactions,
        soldItems,
        grossProfit,
        totalCogs,
        createdAt: now,
        updatedAt: now,
      }
    })

    return queryInterface.bulkInsert('DailyReports', data)
  },

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete('DailyReports', null, {}),
}
