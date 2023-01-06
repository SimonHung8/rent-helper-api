const router = require('express').Router()
const authenticated = require('../../middleware/auth')
const lineAuthController = require('../../controllers/line-auth-controller')

// 取得驗證連結
router.get('/', authenticated, lineAuthController.getLink)
// 取得驗證
router.post('/', lineAuthController.getToken)

module.exports = router
