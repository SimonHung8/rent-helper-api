const meetService = require('../services/meet-service')
const responseHelper = require('../helpers/response-helper')

const meetController = {
  addMeet: (req, res, next) => {
    meetService.addMeet(req, (err, code, data) => responseHelper(res, next, err, code, data))
  },
  deleteMeet: (req, res, next) => {
    meetService.deleteMeet(req, (err, code, data) => responseHelper(res, next, err, code, data))
  }
}

module.exports = meetController
