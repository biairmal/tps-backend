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

  const handledErrors = {
    type: 'UniqueViolation',
    fields: nonUniqueFields,
  }

  return handledErrors
}

module.exports = {
  handleUniqueViolation,
}
