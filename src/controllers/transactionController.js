const { transactionServices } = require('../services')

exports.createTransaction = async (req, res) => {
  try {
    const data = await transactionServices.createTransaction(req.body)

    res.status(201).json({
      success: true,
      message: 'Successfully created transaction!',
      data,
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      success: false,
      message: 'Failed to create transaction!',
      error,
    })
  }
}

exports.getTransactions = async (req, res) => {
  try {
    const data = await transactionServices.getTransactions(req.query)

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