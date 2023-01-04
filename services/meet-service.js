const { House, Condition, Meet } = require('../models')

const meetService = {
  addMeet: async (req, cb) => {
    try {
      const HouseId = parseInt(req.body.HouseId)
      const ConditionId = parseInt(req.body.ConditionId)
      const UserId = req.user.id
      if (!HouseId || !ConditionId) return cb(null, 400, { message: 'HouseId and ConditionId are required!' })

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
          ConditionId,
          UserId
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
      console.log(id)
      const UserId = req.user.id
      const isMet = await Meet.findOne({
        where: { id, UserId }
      })
      if (!isMet) return cb(null, 400, { message: '條件原本就不符合' })
      const meet = await isMet.destroy()
      return cb(null, 200, { meet: meet.toJSON() })
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = meetService
