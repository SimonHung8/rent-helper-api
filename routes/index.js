const router = require('express').Router()
const users = require('./modules/users')
const houses = require('./modules/houses')
const expenses = require('./modules/expenses')
const musts = require('./modules/musts')
const mustnots = require('./modules/mustnots')

router.use('/users', users)
router.use('/houses', houses)
router.use('/expenses', expenses)
router.use('/musts', musts)
router.use('/mustnots', mustnots)

module.exports = router
