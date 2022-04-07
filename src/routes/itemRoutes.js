const { Router } = require('express')
const multer = require('multer')
const validateRequestSchema = require('../middlewares/validateRequestSchema')
const itemSchema = require('../validations/itemSchema')
const itemController = require('../controllers/itemController')
const { getStorage } = require('../utils/cloudinary')

const storage = getStorage('items')
const upload = multer({ storage })

const router = Router()

router
  .route('/items')
  .get(itemController.getItems)
  .post(
    upload.single('picture'),
    itemSchema.createItemSchema,
    validateRequestSchema,
    itemController.createItem
  )

router
  .route('/items/:id')
  .get(itemController.getItemById)
  .delete(itemController.deleteItemById)
  .put(upload.single('picture'), itemController.updateItemById)

module.exports = router
