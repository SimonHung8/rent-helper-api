const { Op } = require('sequelize')
const { validationResult } = require('express-validator')
const fetch = require('node-fetch')
const { Region, Section, Kind, Shape, Search, sequelize } = require('../models')
const scrapeHelper = require('../helpers/scrape-helper')

const searchService = {
  addSearch: async (req, cb) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        const errorMessage = errors.errors.map(e => e.msg)
        return cb(null, 400, { message: errorMessage })
      }
      // 如果使用者還沒建立line token
      if (!req.user.token) return cb(null, 400, { message: 'line尚未驗證' })
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

      // 設定header
      const headers = await scrapeHelper.setListHeader()
      headers.cookie += `;urlJumpIp=${isSupportedRegion.externalId};`
      headers.cookie += `urlJumpIpByTxt=${encodeURI(isSupportedRegion.name)};`

      // 設定要請求的網址
      const target = {
        region: isSupportedRegion.externalId,
        sections: isSupportedSections.map(item => item.externalId).join(','),
        kind: isSupportedKind.externalId,
        shape: isSupportedShape.externalId,
        keyword,
        minArea,
        maxArea,
        minPrice,
        maxPrice,
        notCover
      }

      const targetURL = scrapeHelper.setTargetURL(target)
      const targetRes = await fetch(targetURL, { headers })
      // 請求失敗
      if (targetRes.status !== 200) throw new Error('爬不到資料，快來檢查一下')
      const targetData = await targetRes.json()
      // 請求成功但這個搜尋條件沒有資料
      if (!targetData.status) return cb(null, 400, { message: '找不到符合物件' })
      // 建立搜尋條件
      const searchData = await Search.create({
        name,
        UserId,
        keyword: keyword || '',
        region: target.region,
        sections: target.sections,
        kind: target.kind,
        shape: target.shape,
        minPrice,
        maxPrice,
        minArea,
        maxArea,
        notCover,
        results: targetData.data.data.map(item => item.post_id).join(',')
      })

      // 整理要回傳的資料
      const search = searchData.toJSON()
      search.region = region
      search.sections = sections
      search.kind = kind
      search.shape = shape
      delete search.results
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
        search.sections = search.sections.split(',')
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

      // 設定header
      const headers = await scrapeHelper.setListHeader()
      headers.cookie += `;urlJumpIp=${isSupportedRegion.externalId};`
      headers.cookie += `urlJumpIpByTxt=${encodeURI(isSupportedRegion.name)};`

      // 設定要請求的網址
      const target = {
        region: isSupportedRegion.externalId,
        sections: isSupportedSections.map(item => item.externalId).join(','),
        kind: isSupportedKind.externalId,
        shape: isSupportedShape.externalId,
        keyword,
        minArea,
        maxArea,
        minPrice,
        maxPrice,
        notCover
      }
      const targetURL = scrapeHelper.setTargetURL(target)
      const targetRes = await fetch(targetURL, { headers })
      // 請求失敗
      if (targetRes.status !== 200) throw new Error('爬不到資料，快來檢查一下')
      const targetData = await targetRes.json()
      // 請求成功但這個搜尋條件沒有資料
      if (!targetData.status) return cb(null, 400, { message: '找不到符合物件' })

      // 更新搜尋條件
      const searchData = await isSearchExisted.update({
        name,
        UserId,
        keyword: keyword || '',
        region: target.region,
        sections: target.sections,
        kind: target.kind,
        shape: target.shape,
        minPrice,
        maxPrice,
        minArea,
        maxArea,
        notCover,
        results: targetData.data.data.map(item => item.post_id).join(',')
      })

      // 整理要回傳的資料
      const search = searchData.toJSON()
      search.region = region
      search.sections = sections
      search.kind = kind
      search.shape = shape
      delete search.results

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
