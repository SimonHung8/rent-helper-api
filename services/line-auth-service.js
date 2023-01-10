const fetch = require('node-fetch')
const { User } = require('../models')

const lineAuthService = {
  getToken: async (req, cb) => {
    try {
      const { code, state } = req.body
      const user = await User.findByPk(state)
      if (!user) throw new Error('使用者資訊錯誤')
      const tokenResp = await fetch(`https://notify-bot.line.me/oauth/token?grant_type=authorization_code&code=${code}&client_id=${process.env.LINE_CLIENT_ID}&client_secret=${process.env.LINE_CLIENT_SECRET}&redirect_uri=${process.env.LINE_REDIRECT_URI}`, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: 'POST'
      })
      const tokenData = await tokenResp.json()
      if (tokenData.status !== 200) throw new Error('line server error')
      const token = tokenData.access_token
      await user.update({ token })
      return cb(null)
    } catch (err) {
      cb(err)
    }
  }

}

module.exports = lineAuthService
