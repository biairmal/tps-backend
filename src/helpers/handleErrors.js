const createError = require('http-errors')

const handleUniqueViolation = (errors) => {
  const nonUniqueFields = {}

  if (errors.errors) {
    errors.errors.forEach((field) => {
      nonUniqueFields[field.path] = {
        path: field.path,
        value: field.value,
        type: field.type,
        message: field.message,
      }
    })
  }

  const error = new createError[409]()

  error.data = {
    type: 'UniqueViolation',
    fields: nonUniqueFields,
  }

  return error
}

const handleErrors = (errors) => {
  // Handle Unique Violation Errors
  if (errors.name === 'SequelizeUniqueConstraintError') {
    return handleUniqueViolation(errors)
  }

  // Default errors
  const error = new createError[500]()
  error.data = errors.name || 'Internal server errors!'

  return error
}

module.exports = handleErrors
