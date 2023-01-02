const router = require('express').Router()
const authenticated = require('../../middleware/auth')
const expenseController = require('../../controllers/expense-controller')
const { expenseValidator } = require('../../middleware/validator')

// 新增物件的額外支出
router.post('/', authenticated, expenseValidator, expenseController.addExpense)
// 刪除物件的額外支出
router.delete('/:id', authenticated, expenseController.deleteExpense)

module.exports = router
