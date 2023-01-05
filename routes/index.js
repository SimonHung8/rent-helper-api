const router = require('express').Router()
const users = require('./modules/users')
const houses = require('./modules/houses')
const expenses = require('./modules/expenses')
const conditions = require('./modules/conditions')
const meets = require('./modules/meets')
const searches = require('./modules/searches')

router.use('/users', users)
router.use('/houses', houses)
router.use('/expenses', expenses)
router.use('/conditions', conditions)
router.use('/meets', meets)
router.use('/searches', searches)

module.exports = router
