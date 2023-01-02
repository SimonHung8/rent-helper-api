const houseService = require('../services/house-service')
const responseHelper = require('../helpers/response-helper')

const houseController = {
  addHouse: (req, res, next) => {
    houseService.addHouse(req, (err, code, data) => responseHelper(res, next, err, code, data))
  },
  getHouses: (req, res, next) => {
    houseService.getHouses(req, (err, code, data) => responseHelper(res, next, err, code, data))
  },
  getHouseExpenses: (req, res, next) => {
    houseService.getHouseExpenses(req, (err, code, data) => responseHelper(res, next, err, code, data))
  }
}

module.exports = houseController
