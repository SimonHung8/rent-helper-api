const router = require('express').Router()
const authenticated = require('../../middleware/auth')
const houseController = require('../../controllers/house-controller')

// 新增收藏物件
router.post('/', authenticated, houseController.addHouse)

module.exports = router
