const { validationResult } = require('express-validator')
const { Must } = require('../models')

const mustService = {
  addMust: async (req, cb) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        const errorMessage = errors.errors.map(e => e.msg)
        return cb(null, 400, { message: errorMessage })
      }
      // 最多設定10筆必備條件
      const DEFAULT_LIMIT = 10
      const mustsCount = await Must.count({ where: { UserId: req.user.id } })
      if (mustsCount >= DEFAULT_LIMIT) return cb(null, 400, { message: `不得超過${DEFAULT_LIMIT}筆` })
      // 建立額外支出
      const must = await Must.create({
        UserId: req.user.id,
        name: req.body.name
      })
      return cb(null, 200, { must: must.toJSON() })
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = mustService
