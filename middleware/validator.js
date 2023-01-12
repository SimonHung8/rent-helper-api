const { body } = require('express-validator')
const { User, House } = require('../models')

module.exports = {
  registerValidator: [
    body('account').trim().isLength({ min: 4, max: 20 }).withMessage('帳號無效')
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
    body('password').trim().custom(value => {
      if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{4,20}$/.test(value)) return true
      throw new Error()
    }).withMessage('密碼無效'),
    body('checkPassword').trim().custom((value, { req }) => {
      if (value === req.body.password) return true
      throw new Error()
    }).withMessage('密碼不同')
  ],
  expenseValidator: [
    body('name').isLength({ min: 1, max: 20 }).withMessage('名稱無效'),
    body('price').isInt({ min: 1, max: 9999 }).withMessage('金額無效'),
    body('HouseId').custom(async (HouseId, { req }) => {
      try {
        const id = HouseId
        const UserId = req.user.id
        const house = await House.findOne({ where: { id, UserId } })
        if (!house) throw new Error()
        return true
      } catch (err) {
        throw new Error()
      }
    }).withMessage('物件不存在')
  ],
  customizedConditionValidator: [
    body('name').isLength({ min: 1, max: 20 }).withMessage('名稱無效')
  ],
  commentValidator: [
    body('comment').isLength({ max: 200 }).withMessage('評論無效')
  ],
  searchValidator: [
    body('name').isLength({ min: 1, max: 20 }).withMessage('名稱無效'),
    body('keyword').isLength({ max: 20 }).withMessage('關鍵字無效'),
    body('region').isLength({ min: 3, max: 3 }).withMessage('縣市無效'),
    body('sections').custom(sections => {
      if (sections.length >= 1 && sections.length <= 5 && new Set(sections).size === sections.length) return true
      throw new Error()
    }).withMessage('行政區無效'),
    body('kind').isLength({ min: 1 }).withMessage('類型無效'),
    body('shape').isLength({ min: 1 }).withMessage('型態無效'),
    body('minPrice').isInt({ min: 0, max: 50000 }).withMessage('金額無效'),
    body('maxPrice').isInt({ min: 0, max: 50000 }).withMessage('金額無效')
      .bail().custom((maxPrice, { req }) => {
        if (parseInt(maxPrice, 10) >= parseInt(req.body.minPrice, 10)) return true
        throw new Error()
      }).withMessage('金額無效'),
    body('minArea').isInt({ min: 0, max: 50 }).withMessage('坪數無效'),
    body('maxArea').isInt({ min: 0, max: 50 }).withMessage('坪數無效')
      .bail().custom((maxArea, { req }) => {
        if (parseInt(maxArea, 10) >= parseInt(req.body.minArea, 10)) return true
        throw new Error()
      }).withMessage('坪數無效'),
    body('notCover').isBoolean().withMessage('頂加資訊無效')
  ]
}
