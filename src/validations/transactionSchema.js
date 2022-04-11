const { body } = require('express-validator')

const createTransactionSchema = [
  body('buyer')
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('buyer can not be blank')
    .custom((value, { req }) => {
      if (!req.body.buyer.id) {
        const condition1 = req.body.buyer.name !== undefined
        const condition2 = req.body.buyer.phone !== undefined
        return condition1 && condition2
      }
      return typeof value.id === 'number'
    })
    .withMessage('buyer should contain id or object (name, phone)'),
  body('items')
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('name can not be blank')
    .isArray({min:1})
    .withMessage('items should be an array and at least have 1 record'),
  body('customerType')
    .optional()
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('customerType can not be blank'),
  body('notes')
    .optional()
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('notes can not be blank'),
]

module.exports = { createTransactionSchema }
