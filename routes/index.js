const router = require('express').Router()
const users = require('./modules/users')
const houses = require('./modules/houses')

router.use('/users', users)
router.use('/houses', houses)

module.exports = router
