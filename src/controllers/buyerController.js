const response = require('../utils/response')
const { buyerServices } = require('../services')

exports.createBuyer = async (req, res) => {
  try {
    const buyer = req.body

    const data = await buyerServices.create(buyer)

    return response.created(res, data, 'Successfully created buyer!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to create buyer!'
    )
  }
}

exports.getBuyers = async (req, res) => {
  try {
    const data = await buyerServices.get(req.query)

    return response.success(res, data, 'Successfully retrieved buyers!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to retrieve buyers!'
    )
  }
}

exports.getBuyerById = async (req, res) => {
  try {
    const { id } = req.params

    const data = await buyerServices.getById(id)

    if (!data) return response.not_found(res, undefined, 'Buyer not found!')

    return response.success(res, data, 'Successfully retrieved buyer!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to retrieve buyer!'
    )
  }
}

exports.updateBuyerById = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const data = await buyerServices.updateById(id, updateData)

    if (!data) return response.not_found(res, undefined, 'Buyer not found!')

    return response.success(res, data, 'Successfully updated buyer!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to update buyers!'
    )
  }
}

exports.deleteBuyerById = async (req, res) => {
  try {
    const { id } = req.params

    const data = await buyerServices.deleteById(id)

    if (!data) return response.not_found(res, undefined, 'Buyer not found!')

    return response.success(res, undefined, 'Successfully deleted buyer!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to delete buyer!'
    )
  }
}
