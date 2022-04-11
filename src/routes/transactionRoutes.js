const { Router } = require('express')
const { transactionController } = require('../controllers')
const validateRequestSchema = require('../middlewares/validateRequestSchema')
const { transactionSchema } = require('../validations')

const router = Router()

router
  .route('/transactions')
  .get(transactionController.getTransactions)
  .post(
    transactionSchema.createTransactionSchema,
    validateRequestSchema,
    transactionController.createTransaction
  )

module.exports = router
