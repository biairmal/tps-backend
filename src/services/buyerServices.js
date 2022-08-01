const { Op } = require('sequelize')
const { parseSequelizeOptions, getCursorData } = require('../helpers')
const { Buyer } = require('../models')

exports.create = async (buyer, dbOptions = {}) => {
  const createdBuyer = await Buyer.create(
    {
      name: buyer.name,
      phone: buyer.phone,
      email: buyer.email,
      zip: buyer.zip,
      address: buyer.address,
      city: buyer.city,
      country: buyer.country,
    },
    dbOptions
  )

  return createdBuyer
}

exports.get = async (query) => {
  const options = parseSequelizeOptions(query)

  if (query.search) {
    delete options.where
    const where = {
      [Op.or]: [
        { name: { [Op.iLike]: `%${query.search}%` } },
        { phone: { [Op.iLike]: `%${query.search}%` } },
      ],
    }
    options.where = where
  }

  const items = await Buyer.findAll(options)
  const cursor = await getCursorData(Buyer, query)

  const data = {
    edge: items,
    cursor,
  }

  return data
}

exports.getById = async (id) => {
  const buyer = await Buyer.findByPk(id)

  if (!buyer) return null

  return buyer
}

exports.updateById = async (id, updateData, dbOptions = {}) => {
  const buyer = await Buyer.findByPk(id)

  if (!buyer) return null

  buyer.set(updateData)

  await buyer.save(dbOptions)

  return buyer
}

exports.deleteById = async (id) => {
  const buyer = await Buyer.findByPk(id)

  if (!buyer) return null

  await buyer.destroy()

  return true
}
