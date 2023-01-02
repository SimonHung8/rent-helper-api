const userService = require('../services/user-service')
const responseHelper = require('../helpers/response-helper')

const userController = {
  login: (req, res, next) => {
    userService.login(req, (err, code, data) => responseHelper(res, next, err, code, data))
  },
  register: (req, res, next) => {
    userService.register(req, (err, code, data) => responseHelper(res, next, err, code, data))
  }
}

module.exports = userController
