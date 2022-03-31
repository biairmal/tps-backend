const { Router } = require('express')
const validateRequestSchema = require('../middlewares/validateRequestSchema')
const itemSchema = require('../validations/itemSchema')
const itemController = require('../controllers/itemController')

const router = Router()

router
  .route('/items')
  .get(itemController.getItems)
  .post(
    itemSchema.createItemSchema,
    validateRequestSchema,
    itemController.createItem
  )

router
  .route('/items/:id')
  .get(itemController.getItemById)
  .delete(itemController.deleteItemById)
  .put(itemController.updateItemById)

module.exports = router
