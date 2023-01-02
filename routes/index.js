const router = require('express').Router()
const users = require('./modules/users')

router.use('/users', users)

module.exports = router
