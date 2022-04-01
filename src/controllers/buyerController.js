const { buyerServices } = require('../services')

exports.createBuyer = async (req, res) => {
  try {
    const buyer = req.body

    const data = await buyerServices.create(buyer)

    return res.status(201).json({
      success: true,
      message: 'Successfully created buyer!',
      data,
    })
  } catch (errors) {
    const statusCode = errors.status || 500
    const errorData = errors.data || 'Internal server error'

    return res.status(statusCode).json({
      success: false,
      message: 'Failed to create buyer!',
      errors: errorData,
    })
  }
}

exports.getBuyers = async (req, res) => {
  try {
    const data = await buyerServices.get(req.query)

    if (data.errors) throw data.errors

    return res.status(200).json({
      success: true,
      message: 'Successfully retrieved buyers',
      data,
    })
  } catch (errors) {
    const statusCode = errors.status || 500

    return res.status(statusCode).json({
      success: false,
      message: 'Failed to retrieve buyers!',
      errors: errors.message,
    })
  }
}

exports.getBuyerById = async (req, res) => {
  try {
    const { id } = req.params
    const data = await buyerServices.getById(id)

    if (data.errors) throw data.errors

    return res.status(200).json({
      success: true,
      message: 'Successfully retrieved buyer',
      data,
    })
  } catch (errors) {
    const statusCode = errors.status || 500

    return res.status(statusCode).json({
      success: false,
      message: 'Failed to retrieve buyer!',
      errors: errors.message,
    })
  }
}

exports.deleteBuyerById = async (req, res) => {
  try {
    const { id } = req.params
    const data = await buyerServices.deleteById(id)

    if (data.errors) throw data.errors

    return res.status(200).json({
      success: true,
      message: 'Successfully retrieved buyer',
      data,
    })
  } catch (errors) {
    const statusCode = errors.status || 500

    return res.status(statusCode).json({
      success: false,
      message: 'Failed to retrieve buyer!',
      errors: errors.message,
    })
  }
}

exports.updateBuyerById = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const data = await buyerServices.updateById(id, updateData)

    return res.status(200).json({
      success: true,
      message: 'Successfully retrieved buyer',
      data,
    })
  } catch (errors) {
    const statusCode = errors.status || 500

    return res.status(statusCode).json({
      success: false,
      message: 'Failed to retrieve buyer!',
      errors: errors.message,
    })
  }
}
