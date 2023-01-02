const mustService = require('../services/must-service')
const responseHelper = require('../helpers/response-helper')

const mustController = {
  addMust: (req, res, next) => {
    mustService.addMust(req, (err, code, data) => responseHelper(res, next, err, code, data))
  }
}

module.exports = mustController
