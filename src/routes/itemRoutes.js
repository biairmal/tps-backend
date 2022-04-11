const { Router } = require('express')
const multer = require('multer')
const { itemController } = require('../controllers')
const { validateRequestSchema, checkRole } = require('../middlewares')
const { itemSchema } = require('../validations')
const { getStorage } = require('../utils/cloudinary')

const storage = getStorage('items')
const upload = multer({ storage })

const router = Router()

router
  .route('/items')
  .get(
    // checkRole(['admin', 'distributor', 'dealer']),
    itemController.getItems
  )
  .post(
    // checkRole(['admin', 'distributor']),
    upload.single('picture'),
    itemSchema.createItemSchema,
    validateRequestSchema,
    itemController.createItem
  )

router
  .route('/items/:id')
  .get(
    // checkRole(['admin', 'distributor', 'dealer']),
    itemController.getItemById
  )
  .delete(
    // checkRole(['admin', 'distributor']),
    itemController.deleteItemById
  )
  .put(
    // checkRole(['admin', 'distributor']),
    upload.single('picture'),
    itemSchema.updateItemSchema,
    validateRequestSchema,
    itemController.updateItemById
  )

module.exports = router
