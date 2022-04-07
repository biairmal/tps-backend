const { sequelize } = require('../utils/database')
const buyerServices = require('./buyerServices')
const { Transaction, Item, SoldItem, DailyReport } = require('../models')
const { parseSequelizeOptions } = require('../helpers')
const generateInvoice = require('../utils/invoice')

const getBuyerInfo = async (buyer, options = {}) => {
  if (!buyer.id) {
    const createdBuyer = await buyerServices.create(buyer, options)
    return createdBuyer
  }

  return buyerServices.getById(buyer.id)
}

const processItems = async (items, data, options) => {
  let totalProducts = 0
  let totalQuantity = 0
  let subtotalPrice = 0
  let totalPrice = 0

  const itemPromises = items.map(async (item) => {
    const thisItem = await Item.findByPk(item.id)
    thisItem.decrement('quantity', {
      ...options,
      by: item.quantity,
    })
    const itemJSON = thisItem.toJSON()
    const itemInfo = { ...itemJSON, ...{ quantity: item.quantity } }
    return itemInfo
  })

  const itemsInfo = await Promise.all(itemPromises)

  const itemsArray = itemsInfo.map((item) => {
    totalProducts += 1
    totalQuantity += item.quantity
    const price =
      data.customerType === 'dealer' ? item.dealerPrice : item.normalPrice
    subtotalPrice += price
    const itemObj = {
      quantity: item.quantity,
      name: item.name,
      tax: item.tax,
      price,
    }
    return itemObj
  })

  totalPrice = subtotalPrice * (100 - data.discount / 100)

  return { totalProducts, totalQuantity, subtotalPrice, totalPrice, itemsArray }
}

const addToSoldItems = async (items, transactionId, options = {}) => {
  const now = new Date()
  const [date] = await DailyReport.findOrCreate({ where: { date: now } })
  const dateId = date.id

  const soldItemsPromises = items.map(async (item) => {
    const [soldItem] = await SoldItem.upsert(
      {
        itemId: item.id,
        quantity: item.quantity,
        dateId,
        transactionId,
      },
      options
    )
    return soldItem
  })

  const soldItems = await Promise.all(soldItemsPromises)
  return soldItems
}

exports.createTransaction = async (data) => {
  const dbTransaction = await sequelize.transaction()
  const options = { transaction: dbTransaction }

  try {
    const { buyer, items } = data

    const buyerInfo = await getBuyerInfo(buyer, data, options)
    const {
      totalProducts,
      totalQuantity,
      subtotalPrice,
      totalPrice,
      itemsArray,
    } = await processItems(items, data, options)

    // create transaction
    const createdTransaction = await Transaction.create(
      {
        totalProducts,
        totalQuantity,
        subtotalPrice,
        totalPrice,
        discount: data.discount,
        tax: data.tax,
        notes: data.notes,
        cashier: data.cashier,
        buyerId: buyerInfo.id,
      },
      options
    )

    await addToSoldItems(items, createdTransaction.id, options)

    await dbTransaction.commit()

    const invoiceData = {
      buyer: buyerInfo.toJSON(),
      items: itemsArray,
      transactionId: createdTransaction.id
    }

    generateInvoice(invoiceData)

    return createdTransaction
  } catch (error) {
    console.log(error)
    dbTransaction.rollback()
    throw error
  }
}

exports.getTransactions = async (query) => {
  const options = parseSequelizeOptions(query)

  return Transaction.findAll(options)
}
