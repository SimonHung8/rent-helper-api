const { Op } = require('sequelize')
const { validationResult } = require('express-validator')
const { Region, Section, Kind, Shape, Search } = require('../models')

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
  }
}

module.exports = searchService
