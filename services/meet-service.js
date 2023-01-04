const { House, Condition, Meet } = require('../models')

const meetService = {
  addMeet: async (req, cb) => {
    try {
      const HouseId = parseInt(req.body.HouseId)
      const ConditionId = parseInt(req.body.ConditionId)
      const UserId = req.user.id
      if (!HouseId || !ConditionId) return cb(null, 400, { message: '物件或自定義條件不存在' })

      // 反查house與condition
      const house = await House.findOne({
        where: {
          id: HouseId,
          UserId
        }
      })
      if (!house) return cb(null, 400, { message: '物件不存在' })
      const condition = await Condition.findOne({
        where: {
          id: ConditionId,
          UserId
        }
      })
      if (!condition) return cb(null, 400, { message: '自定義條件不存在' })
      // 建立符合條件
      const [meet, created] = await Meet.findOrCreate({
        where: {
          HouseId,
          ConditionId
        }
      })
      if (!created) return cb(null, 400, { message: '此條件已符合' })
      return cb(null, 200, { meet: meet.toJSON() })
    } catch (err) {
      cb(err)
    }
  },
  deleteMeet: async (req, cb) => {
    try {
      const id = parseInt(req.params.id)
      const UserId = req.user.id
      const isMet = await Meet.findByPk(id)
      if (!isMet) return cb(null, 400, { message: '條件原本就不符合' })
      // 檢查是否為使用者的物件
      const house = await House.findOne({ where: { id: isMet.HouseId, UserId } })
      if (!house) return cb(null, 400, { message: '條件原本就不符合' })
      const meet = await isMet.destroy()
      return cb(null, 200, { meet: meet.toJSON() })
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = meetService
