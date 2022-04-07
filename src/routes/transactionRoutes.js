const { Router } = require('express')
// const validateRequestSchema = require('../middlewares/validateRequestSchema')
// const itemSchema = require('../validations/itemSchema')
const { transactionController } = require('../controllers')

const router = Router()

router
  .route('/transactions')
    .get(transactionController.getTransactions)
  .post(transactionController.createTransaction)

module.exports = router
