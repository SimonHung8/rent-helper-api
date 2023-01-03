const { House, Condition, Meet } = require('../models')

const meetService = {
  addMeet: async (req, cb) => {
    try {
      const HouseId = parseInt(req.body.HouseId)
      const ConditionId = parseInt(req.body.ConditionId)
      if (!HouseId || !ConditionId) return cb(null, 400, { message: 'HouseId and ConditionId are required!' })

      // 反查house與condition
      const house = await House.findByPk(HouseId)
      if (!house) return cb(null, 400, { message: '物件不存在' })
      const condition = await Condition.findByPk(ConditionId)
      if (!condition) return cb(null, 400, { message: '自定義條件不存在' })
      // 建立符合條件
      const meet = await Meet.create({
        HouseId,
        ConditionId
      })
      return cb(null, 200, { meet: meet.toJSON() })
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = meetService
