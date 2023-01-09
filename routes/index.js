const router = require('express').Router()
const users = require('./modules/users')
const houses = require('./modules/houses')
const expenses = require('./modules/expenses')
const conditions = require('./modules/conditions')
const meets = require('./modules/meets')
const searches = require('./modules/searches')
const lineAuth = require('./modules/line-auth')

router.use('/users', users)
router.use('/houses', houses)
router.use('/expenses', expenses)
router.use('/conditions', conditions)
router.use('/meets', meets)
router.use('/searches', searches)
router.use('/lineAuth', lineAuth)
router.use('/uptimeRobot', (req, res) => {
  res.status(200).json({ message: 'avoid sleeping' })
})

module.exports = router
