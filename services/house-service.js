const fetch = require('node-fetch')
const { Op } = require('sequelize')
const { validationResult } = require('express-validator')
const root = require('../config/root.json')
const { House, Region, Section, Kind, Shape, Photo, Facility, Service, Expense, Condition, Meet, sequelize } = require('../models')
const scrapeHelper = require('../helpers/scrape-helper')

const houseService = {
  addHouse: async (req, cb) => {
    try {
      const externalId = req.body.externalId
      const UserId = req.user.id
      // 確認是否建立過該物件的資料
      const isInList = await House.findOne({ where: { externalId, UserId } })
      if (isInList) return cb(null, 400, { message: '已收藏的物件' })

      // 設定header並請求
      const headers = await scrapeHelper.setDetailHeader()
      const detailRes = await fetch(`${root.DETAIL_URL}${externalId}`, { headers })
      const photoRes = await fetch(`${root.PHOTO_URL}${externalId}`, { headers })

      // 請求失敗
      if (detailRes.status !== 200 || photoRes.status !== 200) throw new Error('爬不到資料，快來檢查一下')

      const detail = await detailRes.json()
      const photo = await photoRes.json()
      // 請求成功但沒有資料
      if (!detail.status || !photo.status) return cb(null, 400, { message: '物件不存在' })

      // 驗證是否為支援的物件
      const detailData = detail.data
      const photoData = photo.data
      const region = await Region.findOne({ where: { externalId: detailData.regionId }, raw: true })
      if (!region) return cb(null, 400, { message: '服務尚不支援的物件' })
      const section = await Section.findOne({ where: { externalId: detailData.sectionId }, raw: true })
      if (!section) return cb(null, 400, { message: '服務尚不支援的物件' })
      const kind = await Kind.findOne({ where: { externalId: detailData.kind }, raw: true })
      if (!kind) return cb(null, 400, { message: '服務尚不支援的物件' })
      const shape = await Shape.findOne({ where: { name: detailData.info.find(i => i.key === 'shape').value }, raw: true })
      if (!shape) return cb(null, 400, { message: '服務尚不支援的物件' })

      // 建立物件資料與擁有的設備
      const area = detailData.info.find(i => i.key === 'area').value
      const price = detailData.price.replace(/,/g, '')

      const houseData = await sequelize.transaction(async t => {
        // 物件本身的資料
        const result = await House.create({
          UserId,
          externalId,
          name: detailData.title,
          RegionId: region.id,
          SectionId: section.id,
          KindId: kind.id,
          price,
          ShapeId: shape.id,
          area,
          comment: ''
        }, { transaction: t })

        // 物件的照片
        const photos = photoData.photos.map(item => ({
          HouseId: result.id,
          url: item.cutPhoto,
          isCover: item.isCover
        }))
        await Photo.bulkCreate(photos, { transaction: t })

        // 擁有的設備
        if (!detailData.service.facility.length) return result
        const activeFacilities = detailData.service.facility.filter(facility => facility.active).map(item => item.name)
        const facilities = await Facility.findAll({
          where: { name: { [Op.or]: activeFacilities } },
          attributes: ['id'],
          raw: true
        })
        const services = facilities.map(facility => ({
          HouseId: result.id,
          FacilityId: facility.id
        }))
        await Service.bulkCreate(services, { transaction: t })
        return result
      })

      // 整理要回傳的資料
      const house = houseData.toJSON()
      const conditionsCount = await Condition.count({ where: { UserId } })
      house.isAllMet = !conditionsCount
      house.region = region.name
      delete house.RegionId
      house.section = section.name
      delete house.SectionId
      house.kind = kind.name
      delete house.KindId
      house.shape = shape.name
      delete house.ShapeId
      house.cover = photoData.photos.find(item => item.isCover).cutPhoto

      return cb(null, 200, { house })
    } catch (err) {
      cb(err)
    }
  },
  getHouses: async (req, cb) => {
    try {
      // 每次回傳10筆資料
      const DEFAULT_LIMIT = 10
      const page = req.query.page || 1
      const limit = DEFAULT_LIMIT
      const offset = (page - 1) * limit
      const UserId = req.user.id
      const { filter } = req.query
      const conditionsCount = await Condition.count({ where: { UserId } })

      // 不同的篩選情境
      let whereOptions
      if (filter === 'allMet') {
        // 全數符合
        whereOptions = sequelize.and(
          sequelize.where(
            sequelize.literal(
              '(SELECT COUNT(*) FROM Meets WHERE Meets.House_id = House.id)'
            ),
            conditionsCount
          ),
          { UserId }
        )
      } else if (filter === 'notAllMet') {
        // 未全數符合
        whereOptions = sequelize.and(
          sequelize.where(
            sequelize.literal(
              '(SELECT COUNT(*) FROM Meets WHERE Meets.House_id = House.id)'
            ),
            { [Op.lt]: conditionsCount }
          ),
          { UserId }
        )
        // 未傳入參數
      } else {
        whereOptions = { UserId }
      }

      const houses = await House.findAll({
        where: whereOptions,
        attributes: ['id', 'UserId', 'name', 'price', 'area', 'comment', 'createdAt',
          [sequelize.literal('(SELECT name FROM Regions WHERE Regions.id = House.Region_id)'), 'region'],
          [sequelize.literal('(SELECT name FROM Sections WHERE Sections.id = House.Section_id)'), 'section'],
          [sequelize.literal('(SELECT name FROM Kinds WHERE Kinds.id = House.Kind_id)'), 'kind'],
          [sequelize.literal('(SELECT name FROM Shapes WHERE Shapes.id = House.Shape_id)'), 'shape'],
          [sequelize.literal('(SELECT url FROM Photos WHERE Photos.House_id = House.id AND Photos.is_cover = true)'), 'cover'],
          [sequelize.literal('(SELECT SUM(price) FROM Expenses WHERE Expenses.House_id = House.id)'), 'extraExpenses'],
          [sequelize.literal(`CASE WHEN (SELECT COUNT(*) From Meets WHERE Meets.House_id = House.id) = ${conditionsCount} THEN true ELSE false END`), 'isAllMet']
        ],
        order: [['createdAt', 'DESC'], ['id', 'ASC']],
        limit,
        offset,
        raw: true
      })
      // 總覽清單只會顯示前30個字
      houses.forEach(house => {
        house.comment = house.comment.substring(0, 30)
      })
      return cb(null, 200, { houses })
    } catch (err) {
      cb(err)
    }
  },
  getHouse: async (req, cb) => {
    try {
      const id = req.params.id
      const UserId = req.user.id
      const house = await House.findOne({
        where: { id, UserId },
        include: [
          // 照片
          { model: Photo, attributes: ['id', 'url', 'isCover'] },
          // 設備
          { model: Facility, as: 'ServicedFacilities', attributes: ['id', 'name'] },
          // 支出
          { model: Expense, attributes: ['id', 'name', 'price'] }
        ],
        attributes: ['id', 'UserId', 'externalId', 'name', 'price', 'area', 'comment',
          [sequelize.literal('(SELECT name FROM Regions WHERE Regions.id = House.Region_id)'), 'region'],
          [sequelize.literal('(SELECT name FROM Sections WHERE Sections.id = House.Section_id)'), 'section'],
          [sequelize.literal('(SELECT name FROM Kinds WHERE Kinds.id = House.Kind_id)'), 'kind'],
          [sequelize.literal('(SELECT name FROM Shapes WHERE Shapes.id = House.Shape_id)'), 'shape'],
          [sequelize.literal('(SELECT SUM(price) FROM Expenses WHERE Expenses.House_id = House.id)'), 'extraExpenses']
        ],
        nest: true
      })
      if (!house) return cb(null, 400, { message: '物件不存在' })

      // 自定義條件
      const conditions = await Condition.findAll({
        where: {
          UserId
        },
        attributes: ['id', 'name',
          [sequelize.literal(`(SELECT id FROM Meets WHERE Meets.Condition_id = Condition.id AND Meets.House_id = ${id})`), 'meetId']
        ],
        raw: true
      })
      return cb(null, 200, { house: house.toJSON(), conditions })
    } catch (err) {
      cb(err)
    }
  },
  editHouseComment: async (req, cb) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        const errorMessage = errors.errors.map(e => e.msg)
        return cb(null, 400, { message: errorMessage })
      }
      const comment = req.body.comment || ''
      const id = req.params.id
      const UserId = req.user.id
      const house = await House.findOne({ where: { id, UserId } })
      if (!house) return cb(null, 400, { message: '物件不存在' })
      const updatedHouse = await house.update({ comment })
      return cb(null, 200, { house: updatedHouse.toJSON() })
    } catch (err) {
      cb(err)
    }
  },
  deleteHouse: async (req, cb) => {
    try {
      const id = req.params.id
      const UserId = req.user.id
      const house = await House.findOne({ where: { id, UserId } })
      if (!house) return cb(null, 400, { message: '物件不存在' })
      // 刪除house與關聯資料
      const deletedHouse = await sequelize.transaction(async t => {
        // 照片
        await Photo.destroy({ where: { HouseId: id }, transaction: t })
        // 支出
        await Expense.destroy({ where: { HouseId: id }, transaction: t })
        // 設備
        await Service.destroy({ where: { HouseId: id }, transaction: t })
        // 符合條件
        await Meet.destroy({ where: { HouseId: id }, transaction: t })
        const result = await house.destroy({ transaction: t })
        return result
      })
      return cb(null, 200, { house: deletedHouse.toJSON() })
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = houseService
