const router = require('express').Router()
const authenticated = require('../../middleware/auth')
const searchController = require('../../controllers/search-controller')
const { searchValidator } = require('../../middleware/validator')

// 符合自定義條件
router.post('/', authenticated, searchValidator, searchController.addSearch)

module.exports = router
