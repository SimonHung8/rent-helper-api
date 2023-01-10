const router = require('express').Router()
const lineAuthController = require('../../controllers/line-auth-controller')

// 使用者取消驗證
router.get('/', lineAuthController.failRedirect)

// 取得驗證
router.post('/', lineAuthController.getToken)

module.exports = router
