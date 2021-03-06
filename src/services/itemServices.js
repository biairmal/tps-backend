const { Op } = require('sequelize')
const { Item } = require('../models')
const { parseSequelizeOptions, getCursorData } = require('../helpers')
const { deleteCloudPicture } = require('../utils/cloudinary')

exports.create = async (item) => {
  const result = await Item.create({
    code: item.code,
    name: item.name,
    description: item.description,
    picture: item.picture,
    quantity: item.quantity,
    cogs: item.cogs,
    normalPrice: item.normalPrice,
    dealerPrice: item.dealerPrice,
    discount: item.discount,
    tax: item.tax,
    createdBy: item.createdBy,
  })

  return result
}

exports.get = async (query) => {
  const options = parseSequelizeOptions(query)

  if (query.search) {
    delete options.where
    const where = {
      [Op.or]: [
        { code: { [Op.iLike]: `%${query.search}%` } },
        { name: { [Op.iLike]: `%${query.search}%` } },
      ],
    }
    options.where = where
  }

  const items = await Item.findAll(options)
  const cursor = await getCursorData(Item, query)

  const data = {
    edge: items,
    cursor,
  }

  return data
}

exports.getById = async (id) => {
  const item = await Item.findByPk(id)

  if (!item) return null

  return item
}

exports.updateById = async (id, data) => {
  const item = await Item.findByPk(id)

  if (!item) return null

  if (item.picture) deleteCloudPicture(item.picture)

  item.set(data)

  await item.save()

  return item
}

exports.deleteById = async (id) => {
  const item = await Item.findByPk(id)

  if (!item) return null

  if (item.picture) deleteCloudPicture(item.picture)

  await item.destroy()

  return true
}
