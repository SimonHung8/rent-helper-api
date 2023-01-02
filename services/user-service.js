const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const { User } = require('../models')

const userService = {
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
      userData.token = false
      // 刪除不必要資訊
      delete userData.createdAt
      delete userData.updatedAt
      // sign JWT token
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '14d' })
      return cb(null, 200, { user: userData, token })
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = userService
