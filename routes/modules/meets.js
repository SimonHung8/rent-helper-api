const router = require('express').Router()
const authenticated = require('../../middleware/auth')
const meetController = require('../../controllers/meet-controller')

// 符合自定義條件
router.post('/', authenticated, meetController.addMeet)
// 取消符合自定義條件
router.delete('/:id', authenticated, meetController.deleteMeet)

module.exports = router
