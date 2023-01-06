const lineAuthService = require('../services/line-auth-service')
const responseHelper = require('../helpers/response-helper')

const lineAuthController = {
  getLink: (req, res, next) => {
    lineAuthService.getLink(req, (err, code, data) => responseHelper(res, next, err, code, data))
  },
  getToken: (req, res, next) => {
    lineAuthService.getToken(req, (err, code, data) => responseHelper(res, next, err, code, data))
  }
}

module.exports = lineAuthController
