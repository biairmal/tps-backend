const response = require('../utils/reponse')
const { transactionServices } = require('../services')

exports.createTransaction = async (req, res) => {
  try {
    const data = await transactionServices.createTransaction(req.body)

    return response.created(res, data, 'Successfully created transaction!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(res, undefined)
  }
}

exports.getTransactions = async (req, res) => {
  try {
    const data = await transactionServices.getTransactions(req.query)

    return response.success(res, data, 'Successfully retrieved transactions!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to retrieve transactions!'
    )
  }
}
