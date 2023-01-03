const { validationResult } = require('express-validator')
const { Condition, Meet, sequelize } = require('../models')

const conditionService = {
  addCondition: async (req, cb) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        const errorMessage = errors.errors.map(e => e.msg)
        return cb(null, 400, { message: errorMessage })
      }
      // 最多設定10筆必備條件
      const DEFAULT_LIMIT = 10
      const UserId = req.user.id
      const conditionsCount = await Condition.count({ where: { UserId } })
      if (conditionsCount >= DEFAULT_LIMIT) return cb(null, 400, { message: `不得超過${DEFAULT_LIMIT}筆` })
      // 建立自定義條件
      const condition = await Condition.create({
        UserId,
        name: req.body.name
      })
      return cb(null, 200, { condition: condition.toJSON() })
    } catch (err) {
      cb(err)
    }
  },
  deleteCondition: async (req, cb) => {
    try {
      const id = parseInt(req.params.id)
      if (!id) return cb(null, 400, { message: '自定義條件不存在' })
      const UserId = req.user.id
      const condition = await Condition.findOne({ where: { id, UserId } })
      if (!condition) return cb(null, 400, { message: '自定義條件不存在' })
      // 刪除condition與關聯的meet
      const deletedCondition = await sequelize.transaction(async t => {
        await Meet.destroy({ where: { ConditionId: condition.id }, transaction: t })
        const result = await condition.destroy({ transaction: t })
        return result
      })
      return cb(null, 200, { condition: deletedCondition.toJSON() })
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = conditionService
