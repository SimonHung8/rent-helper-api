const { validationResult } = require('express-validator')
const { Mustnot } = require('../models')

const mustnotService = {
  addMustnot: async (req, cb) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        const errorMessage = errors.errors.map(e => e.msg)
        return cb(null, 400, { message: errorMessage })
      }
      // 最多設定10筆必備條件
      const DEFAULT_LIMIT = 10
      const mustnotsCount = await Mustnot.count({ where: { UserId: req.user.id } })
      if (mustnotsCount >= DEFAULT_LIMIT) return cb(null, 400, { message: `不得超過${DEFAULT_LIMIT}筆` })
      // 建立額外支出
      const mustnot = await Mustnot.create({
        UserId: req.user.id,
        name: req.body.name
      })
      return cb(null, 200, { mustnot: mustnot.toJSON() })
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = mustnotService
