const path = require('path')
const lineAuthService = require('../services/line-auth-service')

const lineAuthController = {
  getToken: (req, res) => {
    lineAuthService.getToken(req, (err) => {
      if (err) {
        if (err.message === '使用者資訊錯誤') {
          return res.send('<h3>使用者資訊錯誤</h3>')
        }
        return res.send('<h3>Server Error</h3>')
      }
      return res.sendFile(path.join(__dirname, '../views', 'success.html'))
    })
  }
}

module.exports = lineAuthController
