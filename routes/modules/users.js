const router = require('express').Router()
const userController = require('../../controllers/user-controller')
const authenticated = require('../../middleware/auth')
const { registerValidator } = require('../../middleware/validator')

// 使用者驗證line
router.get('/lineAuth', authenticated, userController.getLineAuthLink)
// 使用者登入
router.post('/login', userController.login)
// 使用者註冊
router.post('/', registerValidator, userController.register)

module.exports = router
