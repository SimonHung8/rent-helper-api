const searchService = require('../services/search-service')
const responseHelper = require('../helpers/response-helper')

const searchController = {
  addSearch: (req, res, next) => {
    searchService.addSearch(req, (err, code, data) => responseHelper(res, next, err, code, data))
  }
}

module.exports = searchController
