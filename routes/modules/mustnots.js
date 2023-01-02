const router = require('express').Router()
const authenticated = require('../../middleware/auth')
const mustnotController = require('../../controllers/mustnot-controller')
const { customizedConditionValidator } = require('../../middleware/validator')

// 新增自訂避免條件
router.post('/', authenticated, customizedConditionValidator, mustnotController.addMustnot)

module.exports = router
