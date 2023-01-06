const path = require('path')
const lineAuthService = require('../services/line-auth-service')
const responseHelper = require('../helpers/response-helper')

const lineAuthController = {
  getLink: (req, res, next) => {
    lineAuthService.getLink(req, (err, code, data) => responseHelper(res, next, err, code, data))
  },
  getToken: (req, res) => {
    lineAuthService.getToken(req, (err) => {
      if (err) {
        if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError' || err.name === 'NotBeforeError' || err.message === '使用者資訊錯誤') {
          return res.send('<h3>使用者資訊錯誤</h3>')
        }
        return res.send('<h3>Server Error</h3>')
      }
      return res.sendFile(path.join(__dirname, '../views', 'success.html'))
    })
  }
}

module.exports = lineAuthController
