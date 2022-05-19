const fs = require('fs')
const path = require('path')
const response = require('../utils/response')

const baseUrl = 'http://localhost:8000/files/'

exports.getListFiles = (req, res) => {
  const directoryPath = path.join(__dirname, '../../invoices/')

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return response.internal_server_error(
        res,
        undefined,
        'Failed to retrieve files!'
      )
    }

    const fileInfos = []

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      })
    })

    return response.success(res, fileInfos, 'Successfully retrieved files!')
  })
}

exports.downloadFile = (req, res) => {
  const fileName = req.params.name
  const directoryPath = path.join(__dirname, '../../invoices/')

  return res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      response.internal_server_error(res, err, 'Could not download file!')
    }
  })
}
