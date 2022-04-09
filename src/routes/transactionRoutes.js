const { Router } = require('express')
const { transactionController } = require('../controllers')
// const validateRequestSchema = require('../middlewares/validateRequestSchema')
// const itemSchema = require('../validations/itemSchema')

const router = Router()

router
  .route('/transactions')
  .get(transactionController.getTransactions)
  .post(transactionController.createTransaction)

module.exports = router
