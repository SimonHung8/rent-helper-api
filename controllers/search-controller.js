const searchService = require('../services/search-service')
const responseHelper = require('../helpers/response-helper')

const searchController = {
  addSearch: (req, res, next) => {
    searchService.addSearch(req, (err, code, data) => responseHelper(res, next, err, code, data))
  },
  getSearches: (req, res, next) => {
    searchService.getSearches(req, (err, code, data) => responseHelper(res, next, err, code, data))
  },
  getSearch: (req, res, next) => {
    searchService.getSearch(req, (err, code, data) => responseHelper(res, next, err, code, data))
  },
  deleteSearch: (req, res, next) => {
    searchService.deleteSearch(req, (err, code, data) => responseHelper(res, next, err, code, data))
  }
}

module.exports = searchController
