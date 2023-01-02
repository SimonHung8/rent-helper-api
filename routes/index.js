const router = require('express').Router()
const users = require('./modules/users')
const houses = require('./modules/houses')
const expenses = require('./modules/expenses')

router.use('/users', users)
router.use('/houses', houses)
router.use('/expenses', expenses)

module.exports = router
