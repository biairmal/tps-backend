const { sequelize } = require('../utils/database')
const buyerServices = require('./buyerServices')
const { Transaction, Item, SoldItem, DailyReport } = require('../models')
const { parseSequelizeOptions, getCursorData } = require('../helpers')
const generateInvoice = require('../utils/invoice')

exports.createTransaction = async (data, user) => {
  const { buyer, items } = data

  const dbTransaction = await sequelize.transaction()
  const options = { transaction: dbTransaction }

  try {
    const transaction = await Transaction.create({}, options)

    // find or create buyer
    let buyerInfo

    if (!buyer.id) {
      buyerInfo = await buyerServices.create(buyer, options)
    } else {
      buyerInfo = await buyerServices.getById(buyer.id)
    }

    const now = new Date()
    const [date] = await DailyReport.findOrCreate({
      ...options,
      ...{ where: { date: now } },
    })

    // process items
    const buyQuantity = {}
    const selectedItem = []

    items.forEach((item) => {
      buyQuantity[item.id] = item.quantity
      selectedItem.push(item.id)
    })

    const itemsInfo = await Item.findAll({ where: { id: selectedItem } })
    itemsInfo.forEach((item) => {
      if (item.quantity < buyQuantity[item.id])
        throw new Error('Insufficient item quantity!')
    })

    let totalProducts = 0
    let totalQuantity = 0
    let subtotalPrice = 0
    let totalPrice = 0

    const itemsArrayPromises = itemsInfo.map(async (item) => {
      let price =
        String(buyer.customerType).toLowerCase() === 'dealer'
          ? item.dealerPrice
          : item.normalPrice

      if (item.discount > 0 && item.discount <= 100)
        price = (price * (100 - item.discount)) / 100

      totalProducts += 1
      totalQuantity += buyQuantity[item.id]
      subtotalPrice += price
      totalPrice += (price * (100 + item.tax)) / 100

      await SoldItem.create(
        {
          itemId: item.id,
          quantity: buyQuantity[item.id],
          priceATT: price,
          cogsATT: item.cogs,
          dateId: date.id,
          transactionId: transaction.id,
        },
        options
      )

      // decrement stock
      await item.decrement('quantity', {
        ...options,
        by: buyQuantity[item.id],
      })

      return {
        name: item.name,
        price,
        quantity: buyQuantity[item.id],
        tax: item.tax,
      }
    })

    const itemsArray = await Promise.all(itemsArrayPromises)

    const invoiceData = {
      buyer: buyerInfo.toJSON(),
      items: itemsArray,
      transactionId: transaction.id,
    }

    const invoicePath = await generateInvoice(invoiceData)

    transaction.set({
      totalProducts,
      totalQuantity,
      subtotalPrice,
      totalPrice,
      cashierId: user.id,
      buyerId: buyerInfo.id,
      invoice: invoicePath,
    })

    await transaction.save(options)

    await dbTransaction.commit()

    return transaction
  } catch (error) {
    console.log(error)

    dbTransaction.rollback()

    throw error
  }
}

exports.getTransactions = async (query) => {
  const options = parseSequelizeOptions(query)

  const transactions = await Transaction.findAll(options)
  const cursor = await getCursorData(Transaction, query)

  return {
    cursor,
    edge: transactions,
  }
}
