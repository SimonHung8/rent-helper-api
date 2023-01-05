const router = require('express').Router()
const authenticated = require('../../middleware/auth')
const searchController = require('../../controllers/search-controller')
const { searchValidator } = require('../../middleware/validator')

// 新增搜尋條件
router.post('/', authenticated, searchValidator, searchController.addSearch)
// 取得全部搜尋條件
router.get('/', authenticated, searchController.getSearches)
// 刪除搜尋條件
router.delete('/:id', authenticated, searchController.deleteSearch)

module.exports = router
