const { validationResult } = require('express-validator')
const { Expense } = require('../models')

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
      return cb(null, 200, { expense })
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = expenseService
