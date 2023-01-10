const router = require('express').Router()
const lineAuthController = require('../../controllers/line-auth-controller')

// 取得驗證
router.post('/', lineAuthController.getToken)

module.exports = router
