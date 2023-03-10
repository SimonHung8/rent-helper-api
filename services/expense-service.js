const { validationResult } = require('express-validator')
const { Expense, House } = require('../models')

const expenseService = {
  addExpense: async (req, cb) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        const errorMessage = errors.errors.map(e => e.msg)
        return cb(null, 400, { message: errorMessage })
      }
      const { name, price, HouseId } = req.body
      // 單一物件最多設定10筆額外支出
      const DEFAULT_LIMIT = 10
      const expensesCount = await Expense.count({ where: { HouseId } })
      if (expensesCount >= DEFAULT_LIMIT) return cb(null, 400, { message: `不得超過${DEFAULT_LIMIT}筆` })
      // 建立額外支出
      const expense = await Expense.create({
        HouseId,
        price,
        name
      })
      return cb(null, 200, { expense: expense.toJSON() })
    } catch (err) {
      cb(err)
    }
  },
  deleteExpense: async (req, cb) => {
    const id = req.params.id
    const UserId = req.user.id
    const expense = await Expense.findByPk(id)
    if (!expense) return cb(null, 400, { message: '支出不存在' })
    // 檢查是否為使用者的物件
    const house = await House.findOne({ where: { id: expense.HouseId, UserId } })
    if (!house) return cb(null, 400, { message: '支出不存在' })
    const deletedExpense = await expense.destroy()
    return cb(null, 200, { expense: deletedExpense.toJSON() })
  }
}

module.exports = expenseService
