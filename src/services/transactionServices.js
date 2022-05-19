const { sequelize } = require('../utils/database')
const buyerServices = require('./buyerServices')
const { Transaction, Item, SoldItem, DailyReport } = require('../models')
const { parseSequelizeOptions, getCursorData } = require('../helpers')
const generateInvoice = require('../utils/invoice')

const findOrCreateBuyer = async (buyer, options = {}) => {
  if (!buyer.id) {
    const createdBuyer = await buyerServices.create(buyer, options)

    return createdBuyer
  }

  return buyerServices.getById(buyer.id)
}

const processItems = async (data, transactionId, options = {}) => {
  const { items } = data
  const now = new Date()
  const [date] = await DailyReport.findOrCreate({
    ...options,
    ...{ where: { date: now } },
  })
  const dateId = date.id

  let totalProducts = 0
  let totalQuantity = 0
  let subtotalPrice = 0
  let totalPrice = 0

  const itemsArrayPromises = items.map(async (item) => {
    const thisItem = await Item.findByPk(item.id)

    if (!thisItem) return null

    let price =
      String(data.customerType).toLowerCase() === 'dealer'
        ? thisItem.dealerPrice
        : thisItem.normalPrice

    if (thisItem.discount > 0) price = (price * (100 - thisItem.discount)) / 100

    // add to sold items
    await SoldItem.create(
      {
        itemId: item.id,
        quantity: item.quantity,
        priceATT: price,
        cogsATT: thisItem.cogs,
        dateId,
        transactionId,
      },
      options
    )

    // decrement stock
    await thisItem.decrement('quantity', {
      ...options,
      by: item.quantity,
    })

    const thisItemObj = {
      id: item.id,
      quantity: item.quantity,
      name: thisItem.name,
      tax: thisItem.tax,
      price,
    }

    totalProducts += 1
    totalQuantity += item.quantity
    subtotalPrice += price
    totalPrice += (price * (100 + thisItem.tax)) / 100

    return thisItemObj
  })

  const itemsArray = await Promise.all(itemsArrayPromises)

  return {
    itemsArray,
    totalProducts,
    totalQuantity,
    subtotalPrice,
    totalPrice,
  }
}

exports.createTransaction = async (data) => {
  const dbTransaction = await sequelize.transaction()
  const options = { transaction: dbTransaction }

  try {
    const transaction = await Transaction.create({}, options)

    const buyerInfo = await findOrCreateBuyer(data.buyer, options)

    const {
      itemsArray,
      totalProducts,
      totalQuantity,
      subtotalPrice,
      totalPrice,
    } = await processItems(data, transaction.id, options)

    transaction.set({
      totalProducts,
      totalQuantity,
      subtotalPrice,
      totalPrice,
      notes: data.notes,
      cashier: data.cashier,
      buyerId: buyerInfo.id,
    })

    await transaction.save(options)

    await dbTransaction.commit()

    const invoiceData = {
      buyer: buyerInfo.toJSON(),
      items: itemsArray,
      transactionId: transaction.id,
    }

    generateInvoice(invoiceData)

    return transaction
  } catch (error) {
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
