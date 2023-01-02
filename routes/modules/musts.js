const router = require('express').Router()
const authenticated = require('../../middleware/auth')
const mustController = require('../../controllers/must-controller')
const { customizedConditionValidator } = require('../../middleware/validator')

// 新增自訂必備條件
router.post('/', authenticated, customizedConditionValidator, mustController.addMust)

module.exports = router
