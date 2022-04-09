const { parseSequelizeOptions } = require('../helpers')
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

  return Buyer.findAll(options)
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
