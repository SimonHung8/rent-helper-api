const fetch = require('node-fetch')
const jwt = require('jsonwebtoken')
const { User } = require('../models')

const lineAuthService = {
  getToken: async (req, cb) => {
    try {
      const { code, state } = req.body
      const data = jwt.verify(state, process.env.LINE_AUTH_SECRET)
      const user = await User.findByPk(data.id)
      if (!user) throw new Error('使用者資訊錯誤')
      const tokenResp = await fetch(`https://notify-bot.line.me/oauth/token?grant_type=authorization_code&code=${code}&client_id=${process.env.LINE_CLIENT_ID}&client_secret=${process.env.LINE_CLIENT_SECRET}&redirect_uri=${process.env.LINE_REDIRECT_URI}`, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: 'POST'
      })
      const tokenData = await tokenResp.json()
      if (tokenData.status !== 200) throw new Error('line server error')
      const token = tokenData.access_token
      // 測試帳號訊息
      if (user.account === process.env.TEST_ACCOUNT) {
        await fetch('https://notify-api.line.me/api/notify', {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${token}`
          },
          body: 'message=這是測試帳號，若要使用Line通知服務，請自行註冊帳號密碼',
          method: 'POST'
        })
        return cb(null, { isTestAccount: true })
      }
      await user.update({ token })
      return cb(null, { isTestAccount: false })
    } catch (err) {
      cb(err)
    }
  }

}

module.exports = lineAuthService
