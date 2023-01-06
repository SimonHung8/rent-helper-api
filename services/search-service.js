const { Op } = require('sequelize')
const { validationResult } = require('express-validator')
const { Region, Section, Kind, Shape, Search, sequelize } = require('../models')

const searchService = {
  addSearch: async (req, cb) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        const errorMessage = errors.errors.map(e => e.msg)
        return cb(null, 400, { message: errorMessage })
      }
      // 最多只能有5條搜尋清單
      const DEFAULT_LIMIT = 5
      const UserId = req.user.id
      const searchesCount = await Search.count({ where: { UserId } })
      if (searchesCount >= DEFAULT_LIMIT) return cb(null, 400, { message: `不得超過${DEFAULT_LIMIT}筆` })

      const { name, keyword, region, sections, kind, shape, minPrice, maxPrice, minArea, maxArea, notCover } = req.body
      // 檢查是否為支援的物件
      // 縣市
      const isSupportedRegion = await Region.findOne({ where: { name: region }, raw: true })
      if (!isSupportedRegion) return cb(null, 400, { message: '服務尚不支援的物件' })
      // 行政區
      const isSupportedSections = await Section.findAll({
        where: {
          name: { [Op.or]: sections },
          RegionId: isSupportedRegion.id
        },
        raw: true
      })
      if (isSupportedSections.length !== sections.length) return cb(null, 400, { message: '服務尚不支援的物件' })
      // 類別
      const isSupportedKind = await Kind.findOne({ where: { name: kind }, raw: true })
      if (!isSupportedKind) return cb(null, 400, { message: '服務尚不支援的物件' })
      // 型態
      const isSupportedShape = await Shape.findOne({ where: { name: shape }, raw: true })
      if (!isSupportedShape) return cb(null, 400, { message: '服務尚不支援的物件' })

      // 建立搜尋條件，整理成爬蟲需要的格式
      const searchData = await Search.create({
        name,
        UserId,
        keyword: keyword || '',
        region: isSupportedRegion.externalId,
        sections: isSupportedSections.map(item => item.externalId).join(';'),
        kind: isSupportedKind.externalId,
        shape: isSupportedShape.externalId,
        minPrice,
        maxPrice,
        minArea,
        maxArea,
        notCover
      })

      // 整理要回傳的資料
      const search = searchData.toJSON()
      search.region = region
      search.sections = sections
      search.kind = kind
      search.shape = shape
      return cb(null, 200, { search })
    } catch (err) {
      cb(err)
    }
  },
  getSearches: async (req, cb) => {
    try {
      const UserId = req.user.id
      const searches = await Search.findAll({
        where: {
          UserId
        },
        attributes: ['id', 'UserId', 'name', 'keyword', 'minPrice', 'maxPrice', 'minArea', 'maxArea', 'notCover', 'sections',
          [sequelize.literal('(SELECT name FROM Regions WHERE Regions.external_id = Search.region)'), 'region'],
          [sequelize.literal('(SELECT name FROM Kinds WHERE Kinds.external_id = Search.kind)'), 'kind'],
          [sequelize.literal('(SELECT name FROM Shapes WHERE Shapes.external_id = Search.shape)'), 'shape']
        ],
        order: [['createdAt', 'DESC'], ['id', 'ASC']],
        limit: 5,
        raw: true
      })
      if (!searches.length) return cb(null, 200, { searches })

      // 處理行政區資料
      searches.forEach(search => {
        search.sections = search.sections.split(';')
      })
      for (const search of searches) {
        const sections = await Section.findAll({
          where: {
            externalId: { [Op.or]: search.sections }
          },
          attributes: ['name'],
          raw: true
        })
        search.sections = sections.map(item => item.name)
      }

      return cb(null, 200, { searches })
    } catch (err) {
      cb(err)
    }
  },
  getSearch: async (req, cb) => {
    try {
      const id = parseInt(req.params.id)
      if (!id) return cb(null, 400, { message: '搜尋條件不存在' })
      const UserId = req.user.id
      const search = await Search.findOne({
        where: {
          id,
          UserId
        },
        attributes: ['id', 'UserId', 'name', 'keyword', 'minPrice', 'maxPrice', 'minArea', 'maxArea', 'notCover', 'sections',
          [sequelize.literal('(SELECT name FROM Regions WHERE Regions.external_id = Search.region)'), 'region'],
          [sequelize.literal('(SELECT name FROM Kinds WHERE Kinds.external_id = Search.kind)'), 'kind'],
          [sequelize.literal('(SELECT name FROM Shapes WHERE Shapes.external_id = Search.shape)'), 'shape']
        ],
        raw: true
      })
      if (!search) return cb(null, 400, { message: '搜尋條件不存在' })
      // 處理行政區資料
      const sectionsArr = search.sections.split(';')
      const sections = await Section.findAll({
        where: {
          externalId: { [Op.or]: sectionsArr }
        },
        attributes: ['name'],
        raw: true
      })
      // 整理回傳資料
      search.sections = sections.map(item => item.name)
      return cb(null, 200, { search })
    } catch (err) {
      cb(err)
    }
  },
  editSearch: async (req, cb) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        const errorMessage = errors.errors.map(e => e.msg)
        return cb(null, 400, { message: errorMessage })
      }

      const id = parseInt(req.params.id)
      if (!id) return cb(null, 400, { message: '搜尋條件不存在' })
      const UserId = req.user.id
      const isSearchExisted = await Search.findOne({ where: { id, UserId } })
      if (!isSearchExisted) return cb(null, 400, { message: '搜尋條件不存在' })

      const { name, keyword, region, sections, kind, shape, minPrice, maxPrice, minArea, maxArea, notCover } = req.body
      // 檢查是否為支援的物件
      // 縣市
      const isSupportedRegion = await Region.findOne({ where: { name: region }, raw: true })
      if (!isSupportedRegion) return cb(null, 400, { message: '服務尚不支援的物件' })
      // 行政區
      const isSupportedSections = await Section.findAll({
        where: {
          name: { [Op.or]: sections },
          RegionId: isSupportedRegion.id
        },
        raw: true
      })
      if (isSupportedSections.length !== sections.length) return cb(null, 400, { message: '服務尚不支援的物件' })
      // 類別
      const isSupportedKind = await Kind.findOne({ where: { name: kind }, raw: true })
      if (!isSupportedKind) return cb(null, 400, { message: '服務尚不支援的物件' })
      // 型態
      const isSupportedShape = await Shape.findOne({ where: { name: shape }, raw: true })
      if (!isSupportedShape) return cb(null, 400, { message: '服務尚不支援的物件' })

      // 建立搜尋條件，整理成爬蟲需要的格式
      const searchData = await isSearchExisted.update({
        name,
        UserId,
        keyword: keyword || '',
        region: isSupportedRegion.externalId,
        sections: isSupportedSections.map(item => item.externalId).join(';'),
        kind: isSupportedKind.externalId,
        shape: isSupportedShape.externalId,
        minPrice,
        maxPrice,
        minArea,
        maxArea,
        notCover
      })

      // 整理要回傳的資料
      const search = searchData.toJSON()
      search.region = region
      search.sections = sections
      search.kind = kind
      search.shape = shape
      return cb(null, 200, { search })
    } catch (err) {
      cb(err)
    }
  },
  deleteSearch: async (req, cb) => {
    try {
      const id = parseInt(req.params.id)
      if (!id) return cb(null, 400, { message: '搜尋條件不存在' })
      const UserId = req.user.id
      const searchData = await Search.findOne({ where: { id, UserId } })
      if (!searchData) return cb(null, 400, { message: '搜尋條件不存在' })
      const deletedSearch = await searchData.destroy()
      return cb(null, 200, { search: deletedSearch.toJSON() })
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = searchService
