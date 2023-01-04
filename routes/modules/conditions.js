const router = require('express').Router()
const authenticated = require('../../middleware/auth')
const conditionController = require('../../controllers/condition-controller')
const { customizedConditionValidator } = require('../../middleware/validator')

// 取得全部自定義條件
router.get('/', authenticated, conditionController.getConditions)
// 新增自定義條件
router.post('/', authenticated, customizedConditionValidator, conditionController.addCondition)
// 刪除自定義條件
router.delete('/:id', authenticated, conditionController.deleteCondition)

module.exports = router
