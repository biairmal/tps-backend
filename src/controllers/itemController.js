const { itemServices } = require('../services')

exports.createItem = async (req, res) => {
  try {
    const item = req.body
    if (req.file) item.picture = req.file.path

    const data = await itemServices.create(item)

    return res.status(201).json({
      success: true,
      message: 'Successfully created item!',
      data,
    })
  } catch (errors) {
    const statusCode = errors.status || 500
    const errorData = errors.data || 'Internal server error'

    return res.status(statusCode).json({
      success: false,
      message: 'Failed to create item!',
      errors: errorData,
    })
  }
}

exports.getItems = async (req, res) => {
  try {
    const data = await itemServices.get(req.query)

    if (data.errors) throw data.errors

    return res.status(200).json({
      success: true,
      message: 'Successfully retrieved items',
      data,
    })
  } catch (errors) {
    const statusCode = errors.status || 500

    return res.status(statusCode).json({
      success: false,
      message: 'Failed to retrieve items!',
      errors: errors.message,
    })
  }
}

exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params
    const data = await itemServices.getById(id)

    if (data.errors) throw data.errors

    return res.status(200).json({
      success: true,
      message: 'Successfully retrieved item',
      data,
    })
  } catch (errors) {
    const statusCode = errors.status || 500

    return res.status(statusCode).json({
      success: false,
      message: 'Failed to retrieve item!',
      errors: errors.message,
    })
  }
}

exports.deleteItemById = async (req, res) => {
  try {
    const { id } = req.params
    const data = await itemServices.deleteById(id)

    return res.status(200).json({
      success: true,
      message: 'Successfully retrieved item',
      data,
    })
  } catch (errors) {
    const statusCode = errors.status || 500

    return res.status(statusCode).json({
      success: false,
      message: 'Failed to retrieve item!',
      errors: errors.message,
    })
  }
}

exports.updateItemById = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body
    if (req.file) updateData.picture = req.file.path

    const data = await itemServices.updateById(id, updateData)

    return res.status(200).json({
      success: true,
      message: 'Successfully retrieved item',
      data,
    })
  } catch (errors) {
    const statusCode = errors.status || 500

    return res.status(statusCode).json({
      success: false,
      message: 'Failed to retrieve item!',
      errors: errors.message,
    })
  }
}
