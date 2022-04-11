const response = require('../utils/reponse')
const { itemServices } = require('../services')
const { handleUniqueViolation } = require('../helpers/handleSequelizeErrors')

exports.createItem = async (req, res) => {
  try {
    const item = req.body
    if (req.file) item.picture = req.file.path

    const data = await itemServices.create(item)

    return response.created(res, data, 'Successfully created item!')
  } catch (error) {
    console.log(error)

    if (error.name === 'SequelizeUniqueConstraintError') {
      const handledErrors = handleUniqueViolation(error)

      return response.conflict(res, handledErrors, 'Failed to create item!')
    }

    return response.internal_server_error(
      res,
      undefined,
      'Failed to create item!'
    )
  }
}

exports.getItems = async (req, res) => {
  try {
    const data = await itemServices.get(req.query)

    return response.success(res, data, 'Successfully retrieved items!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to retrieve items!'
    )
  }
}

exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params
    const data = await itemServices.getById(id)

    if (!data) return response.not_found(res, undefined, 'Item not found!')

    return response.success(res, data, 'Successfully retrieved item!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to retrieve item!'
    )
  }
}

exports.updateItemById = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body
    if (req.file) updateData.picture = req.file.path

    const data = await itemServices.updateById(id, updateData)

    if (!data) return response.not_found(res, undefined, 'Item not found!')

    return response.success(res, data, 'Successfully updated item!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to update item!'
    )
  }
}

exports.deleteItemById = async (req, res) => {
  try {
    const { id } = req.params
    const data = await itemServices.deleteById(id)

    if (!data) return response.not_found(res, undefined, 'Item not found!')

    return response.success(res, data, 'Successfully deleted item!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to delete items!'
    )
  }
}
