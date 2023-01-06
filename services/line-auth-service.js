const fetch = require('node-fetch')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User } = require('../models')

const lineAuthService = {
  getLink: (req, cb) => {
    const user = req.user
    if (user.token) return cb(null, 200, { message: 'line已驗證' })
    const payload = {
      id: user.id,
      account: user.account
    }
    const state = jwt.sign(payload, process.env.JWT_SECRET)
    return cb(null, 200, { link: `https://notify-bot.line.me/oauth/authorize?response_type=code&scope=notify&response_mode=form_post&client_id=${process.env.LINE_CLIENT_ID}&redirect_uri=${process.env.LINE_REDIRECT_URI}&state=${state}` })
  },
  getToken: async (req, cb) => {
    try {
      const { code } = req.body
      const user = jwt.verify(req.body.state, process.env.JWT_SECRET)
      const isUserExisted = await User.findOne({ where: { id: user.id, account: user.account } })
      if (!isUserExisted) throw new Error('使用者資訊錯誤')
      const tokenResp = await fetch(`https://notify-bot.line.me/oauth/token?grant_type=authorization_code&code=${code}&client_id=${process.env.LINE_CLIENT_ID}&client_secret=${process.env.LINE_CLIENT_SECRET}&redirect_uri=${process.env.LINE_REDIRECT_URI}`, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: 'POST'
      })
      const tokenData = await tokenResp.json()
      if (tokenData.status !== 200) throw new Error()
      const token = tokenData.access_token
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(token, salt)
      await isUserExisted.update({ token: hash })
      return cb(null)
    } catch (err) {
      cb(err)
    }
  }

}

module.exports = lineAuthService
