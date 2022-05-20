const { Router } = require('express')
const { transactionController } = require('../controllers')
const { checkRole, validateRequestSchema } = require('../middlewares')
const { transactionSchema } = require('../validations')

const router = Router()

router
  .route('/transactions')
  .get(
    checkRole(['distributor', 'admin']),
    transactionController.getTransactions
  )
  .post(
    checkRole(['distributor', 'admin', 'dealer']),
    transactionSchema.createTransactionSchema,
    validateRequestSchema,
    transactionController.createTransaction
  )

module.exports = router
