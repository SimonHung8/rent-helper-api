const router = require('express').Router()
const userController = require('../../controllers/user-controller')
const { registerValidator } = require('../../middleware/validator')

// 使用者登入
router.post('/login', userController.login)
// 使用者註冊
router.post('/', registerValidator, userController.register)

module.exports = router
