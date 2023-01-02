const mustnotService = require('../services/mustnot-service')
const responseHelper = require('../helpers/response-helper')

const mustnotController = {
  addMustnot: (req, res, next) => {
    mustnotService.addMustnot(req, (err, code, data) => responseHelper(res, next, err, code, data))
  }
}

module.exports = mustnotController
