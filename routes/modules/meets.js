const router = require('express').Router()
const authenticated = require('../../middleware/auth')
const meetController = require('../../controllers/meet-controller')

// 符合自定義條件
router.post('/', authenticated, meetController.addMeet)

module.exports = router
