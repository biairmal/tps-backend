const createError = require('http-errors')
const { handleErrors, parseSequelizeOptions } = require('../helpers')
const { Buyer } = require('../models')

exports.create = async (buyer, dbOptions = {}) => {
  try {
    const { name, phone, email, address } = buyer

    const createdBuyer = await Buyer.create(
      {
        name,
        phone,
        email,
        address,
      },
      dbOptions
    )

    return createdBuyer
  } catch (error) {
    throw handleErrors(error)
  }
}

exports.get = async (query) => {
  const options = parseSequelizeOptions(query)

  return Buyer.findAll(options)
}

exports.getById = async (id) => {
  const buyer = await Buyer.findByPk(id)

  if (!buyer) throw createError(404, 'Buyer not found!')

  return buyer
}

exports.deleteById = async (id) => {
  const buyer = await Buyer.findByPk(id)

  if (!buyer) throw createError(404, 'Buyer not found!')

  const deletedRow = await buyer.destroy()

  return { deletedRow }
}

exports.updateById = async (id, updateData, dbOptions = {}) => {
  try {
    const buyer = await Buyer.findByPk(id)

    if (!buyer) throw createError(404, 'Buyer not found!')

    console.log(buyer)
    buyer.set(updateData)
    console.log(buyer)

    const updatedBuyer = await buyer.save(dbOptions)

    return updatedBuyer
  } catch (error) {
    console.log(error)
    throw error
  }
}
