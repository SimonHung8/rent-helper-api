const router = require('express').Router()
const path = require('path')
const lineAuthController = require('../../controllers/line-auth-controller')

// 使用者取消驗證
router.get('/', (req, res) => res.sendFile(path.join(__dirname, '../../views', 'fail.html')))

// 取得驗證
router.post('/', lineAuthController.getToken)

module.exports = router
