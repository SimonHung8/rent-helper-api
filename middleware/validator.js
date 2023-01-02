const { body } = require('express-validator')
const { User, House } = require('../models')

module.exports = {
  registerValidator: [
    body('account').trim().isLength({ min: 8, max: 20 }).withMessage('帳號無效')
      .bail().custom(async account => {
        try {
          const user = await User.findOne({ where: { account } })
          if (user) throw new Error()
          return true
        } catch (err) {
          throw new Error()
        }
      }).withMessage('已經註冊過的帳號'),
    body('name').trim().isLength({ min: 1, max: 20 }).withMessage('名稱無效'),
    body('password').trim().isStrongPassword().withMessage('密碼無效')
      .bail().isLength({ max: 20 }).withMessage('密碼無效'),
    body('checkPassword').trim().custom((value, { req }) => {
      if (value === req.body.password) return true
      throw new Error()
    }).withMessage('密碼不同')
  ],
  expenseValidator: [
    body('name').isLength({ min: 1, max: 10 }).withMessage('名稱無效'),
    body('price').isInt({ min: 1, max: 9999 }).withMessage('金額無效'),
    body('HouseId').custom(async HouseId => {
      try {
        const id = parseInt(HouseId)
        if (!id) throw new Error()
        const house = await House.findByPk(id)
        if (!house) throw new Error()
        return true
      } catch (err) {
        throw new Error()
      }
    }).withMessage('物件不存在')
  ]
}
