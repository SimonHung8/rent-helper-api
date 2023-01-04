const router = require('express').Router()
const authenticated = require('../../middleware/auth')
const houseController = require('../../controllers/house-controller')
const { commentValidator } = require('../../middleware/validator')

// 編輯單一物件的評論
router.put('/:id/comment', authenticated, commentValidator, houseController.editHouseComment)
// 取得單一物件
router.get('/:id', authenticated, houseController.getHouse)
// 取得全部收藏物件
router.get('/', authenticated, houseController.getHouses)
// 新增收藏物件
router.post('/', authenticated, houseController.addHouse)

module.exports = router
