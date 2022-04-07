const { dailyReportServices } = require('../services')

exports.createDate = async (req, res) => {
  try {
    const data = await dailyReportServices.createDate()

    return res.status(201).json({
      success: true,
      message: 'Successfully created date!',
      data,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: 'Failed to create date',
    })
  }
}

exports.calculateDailyReport = async (req, res) => {
  try {
    const data = await dailyReportServices.calculateDailyReport()

    return res.status(201).json({
      success: true,
      message: 'Successfully calculated daily reports!',
      data,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: 'Failed to calculate daily reports!',
    })
  }
}

exports.getDailyReports = async (req, res) => {
  try {
    const data = await dailyReportServices.getDailyReports()

    return res.status(201).json({
      success: true,
      message: 'Successfully retrieved daily reports!',
      data,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieved daily reports!',
    })
  }
}
