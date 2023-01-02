const router = require('express').Router()
const authenticated = require('../../middleware/auth')
const houseController = require('../../controllers/house-controller')

// 取得全部收藏物件
router.get('/', authenticated, houseController.getHouses)
// 新增收藏物件
router.post('/', authenticated, houseController.addHouse)

module.exports = router
