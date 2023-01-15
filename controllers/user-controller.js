const userService = require('../services/user-service')
const responseHelper = require('../helpers/response-helper')
const jwt = require('jsonwebtoken')

const userController = {
  login: (req, res, next) => {
    userService.login(req, (err, code, data) => responseHelper(res, next, err, code, data))
  },
  register: (req, res, next) => {
    userService.register(req, (err, code, data) => responseHelper(res, next, err, code, data))
  },
  // 將使用者導向line驗證頁面
  getLineAuth: (req, res) => {
    const id = req.user.id
    const state = jwt.sign(id, process.env.JWT_SECRET)
    return res.redirect(`https://notify-bot.line.me/oauth/authorize?response_type=code&scope=notify&response_mode=form_post&client_id=${process.env.LINE_CLIENT_ID}&redirect_uri=${process.env.LINE_REDIRECT_URI}&state=${state}`)
  }
}

module.exports = userController
