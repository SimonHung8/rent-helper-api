const conditionService = require('../services/condition-service')
const responseHelper = require('../helpers/response-helper')

const conditionController = {
  addCondition: (req, res, next) => {
    conditionService.addCondition(req, (err, code, data) => responseHelper(res, next, err, code, data))
  },
  deleteCondition: (req, res, next) => {
    conditionService.deleteCondition(req, (err, code, data) => responseHelper(res, next, err, code, data))
  },
  getConditions: (req, res, next) => {
    conditionService.getConditions(req, (err, code, data) => responseHelper(res, next, err, code, data))
  }
}

module.exports = conditionController
