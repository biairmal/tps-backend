const createError = require('http-errors')
const handleErrors = require('../helpers/handleErrors')
const { Item } = require('../models')

exports.create = async (item) => {
  try {
    const result = await Item.create({
      code: item.code,
      name: item.name,
      description: item.description,
      picture: item.picture,
      quantity: item.quantity,
      cogs: item.cogs,
      normalPrice: item.normalPrice,
      dealerPrice: item.dealerPrice,
      createdBy: item.createdBy,
    })

    return result
  } catch (errors) {
    throw handleErrors(errors)
  }
}

exports.get = async (query) => {
  const options = {}

  if (query) {
    const filter = JSON.parse(JSON.stringify(query))
    if (query.limit) {
      options.limit = parseInt(query.limit, 10)
      delete filter.limit
    }
    if (query.page) {
      options.offset = parseInt(query.limit, 10) * parseInt(query.page, 10)
      delete filter.page
    }
    if (filter) options.where = filter
  }

  return Item.findAll(options)
}

exports.getById = async (id) => {
  const item = await Item.findByPk(id)

  if (!item) throw createError(404, 'Item not found!')

  return item
}

exports.deleteById = async (id) => {
  const deletedRow = await Item.destroy({ where: { id } })

  if (!deletedRow) throw createError(404, 'Item not found!')

  return { deletedRow }
}

exports.updateById = async (id, data) => {
  const updatedRow = await Item.update(data, { where: { id } })

  if (!updatedRow[0]) throw createError(404, 'Item not found!')

  return { updatedRow: updatedRow[0] }
}
