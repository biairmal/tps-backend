const response = require('../utils/response')
const { dailyReportServices } = require('../services')

exports.createDate = async (req, res) => {
  try {
    const data = await dailyReportServices.createDate()

    return response.created(res, data, 'Successfully created daily report!')
  } catch (error) {
    console.log(error)

    if (error.message === 'Already exists')
      return response.conflict(res, undefined, 'Date already exists!')

    return response.internal_server_error(
      res,
      undefined,
      'Failed to create daily report!'
    )
  }
}

exports.getDailyReports = async (req, res) => {
  try {
    const data = await dailyReportServices.getDailyReports(req.query)

    return response.success(res, data, 'Successfully retrieved daily reports!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to retrieve daily reports!'
    )
  }
}

exports.calculateDailyReport = async (req, res) => {
  try {
    const data = await dailyReportServices.calculateDailyReport()

    if (!data)
      return response.not_found(res, undefined, 'Daily report not found!')

    return response.success(res, data, 'Successfully updated daily report!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to update daily reports!'
    )
  }
}
