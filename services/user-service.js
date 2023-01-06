const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const { User } = require('../models')

const userService = {
  login: async (req, cb) => {
    try {
      const { account, password } = req.body
      if (!account || !password) return cb(null, 400, { message: '所有欄位都是必填' })
      const user = await User.findOne({
        where: { account },
        attributes: ['id', 'name', 'account', 'password', 'token']
      })
      if (!user) return cb(null, 401, { message: '帳號或密碼錯誤' })
      const isPasswordCorrect = await bcrypt.compare(password, user.password)
      if (!isPasswordCorrect) return cb(null, 401, { message: '帳號或密碼錯誤' })
      const userData = user.toJSON()
      // 修改敏感資訊
      delete userData.password
      delete userData.token
      // sign JWT token
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '14d' })
      return cb(null, 200, { user: userData, token })
    } catch (err) {
      cb(err)
    }
  },
  register: async (req, cb) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        const errorMessage = errors.errors.map(e => e.msg)
        return cb(null, 400, { message: errorMessage })
      }
      const { name, account, password } = req.body
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
      const user = await User.create({ name, account, password: hash })
      const userData = user.toJSON()
      // 修改敏感資訊
      delete userData.password
      // sign JWT token
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '14d' })
      return cb(null, 200, { user: userData, token })
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = userService
