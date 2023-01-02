const userService = require('../services/user-service')
const responseHelper = require('../helpers/response-helper')

const userController = {
  register: (req, res, next) => {
    userService.register(req, (err, code, data) => responseHelper(res, next, err, code, data))
  }
}

module.exports = userController
