const router = require('express').Router()
const authenticated = require('../../middleware/auth')
const conditionController = require('../../controllers/condition-controller')
const { customizedConditionValidator } = require('../../middleware/validator')

// 新增自定義條件
router.post('/', authenticated, customizedConditionValidator, conditionController.addCondition)
// 刪除自定義條件
router.delete('/:id', authenticated, conditionController.deleteCondition)

module.exports = router
