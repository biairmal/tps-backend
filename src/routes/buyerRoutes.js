const { Router } = require('express')
const { buyerController } = require('../controllers')
const { validateRequestSchema } = require('../middlewares')
const { buyerSchema } = require('../validations')

const router = Router()

router
  .route('/buyers')
  .get(buyerController.getBuyers)
  .post(
    buyerSchema.createBuyerSchema,
    validateRequestSchema,
    buyerController.createBuyer
  )

router
  .route('/buyers/:id')
  .get(buyerController.getBuyerById)
  .delete(buyerController.deleteBuyerById)
  .put(
    buyerSchema.updateBuyerSchema,
    validateRequestSchema,
    buyerController.updateBuyerById
  )

module.exports = router
