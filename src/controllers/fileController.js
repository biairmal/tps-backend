const fs = require('fs')
const path = require('path')

const baseUrl = 'http://localhost:8000/files/'

exports.getListFiles = (req, res) => {
  const directoryPath = path.join(__dirname, '../../invoices/')

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Failed to get files!',
      })

      const fileInfos = []
      files.forEach((file) => {
        fileInfos.push({
          name: file,
          url: baseUrl + file,
        })
      })

      res.status(200).json({
        success: true,
        message: 'Successfully retrieved files!',
        data: fileInfos,
      })
    }
  })
}

exports.downloadFile = (req, res) => {
  const fileName = req.params.name
  const directoryPath = path.join(__dirname, '../../invoices/')
  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: `Could not download the file. + ${err}`,
      })
    }
  })
}
