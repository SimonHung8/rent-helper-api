const expenseService = require('../services/expense-service')
const responseHelper = require('../helpers/response-helper')

const expenseController = {
  addExpense: (req, res, next) => {
    expenseService.addExpense(req, (err, code, data) => responseHelper(res, next, err, code, data))
  },
  deleteExpense: (req, res, next) => {
    expenseService.deleteExpense(req, (err, code, data) => responseHelper(res, next, err, code, data))
  }
}

module.exports = expenseController
