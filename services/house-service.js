const fetch = require('node-fetch')
const { Op } = require('sequelize')
const root = require('../config/root.json')
const { House, Region, Section, Kind, Shape, Photo, Facility, Service, sequelize } = require('../models')

const houseService = {
  addHouse: async (req, cb) => {
    try {
      const externalId = parseInt(req.body.externalId)
      if (!externalId) return cb(null, 400, { message: 'externalId is required' })
      // 設定header
      const headers = { 'User-Agent': 'rent-helper', device: 'pc' }
      const indexRes = await fetch(`${root.INDEX_URL}`, { headers })
      headers.deviceid = indexRes.headers.raw()['set-cookie'].find(cookie => cookie.includes('T591_TOKEN'))
      const detailRes = await fetch(`${root.DETAIL_URL}${externalId}`, { headers })
      const photoRes = await fetch(`${root.PHOTO_URL}${externalId}`, { headers })

      // 請求失敗
      if (detailRes.status !== 200 || photoRes.status !== 200) throw new Error('爬不到資料，快來檢查一下')
      const detailData = await detailRes.json()
      const photoData = await photoRes.json()
      // 請求成功但沒有資料
      if (!detailData.status || !photoData.status) return cb(null, 400, { message: '物件不存在' })

      // 驗證是否為支援的物件
      const region = await Region.findOne({ where: { externalId: detailData.data.regionId } })
      const section = await Section.findOne({ where: { externalId: detailData.data.sectionId } })
      const kind = await Kind.findOne({ where: { externalId: detailData.data.kind } })
      const shape = await Shape.findOne({ where: { name: detailData.data.info.find(i => i.key === 'shape').value } })
      if (!region || !section || !kind || !shape) return cb(null, 400, { message: '服務尚不支援的物件' })

      // 建立物件資料與擁有的設備
      const area = detailData.data.info.find(i => i.key === 'area').value
      const price = parseInt(detailData.data.price.replace(/,/g, ''))

      const houseData = await sequelize.transaction(async t => {
        // 物件本身的資料
        const result = await House.create({
          UserId: req.user.id,
          externalId,
          name: detailData.data.title,
          RegionId: region.id,
          SectionId: section.id,
          KindId: kind.id,
          price,
          ShapeId: shape.id,
          area
        }, { transaction: t })

        // 物件的照片
        const photos = photoData.data.photos.map(photo => ({
          HouseId: result.id,
          url: photo.cutPhoto,
          isCover: photo.isCover
        }))
        await Photo.bulkCreate(photos, { transaction: t })
        result.dataValues.cover = photos.find(photo => photo.isCover).url

        // 擁有的設備
        if (!detailData.data.service.facility.length) return result
        const activeFacilities = detailData.data.service.facility.filter(facility => facility.active).map(item => item.name)
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

      return cb(null, 200, { house: houseData.toJSON() })
    } catch (err) {
      cb(err)
    }
  },
  getHouses: async (req, cb) => {
    try {
      // 每次回傳10筆資料
      const DEFAULT_LIMIT = 10
      const page = parseInt(req.query.page) || 1
      const limit = DEFAULT_LIMIT
      const offset = (page - 1) * limit
      const houses = await House.findAll({
        where: { UserId: req.user.id },
        include: [
          { model: Region, attributes: ['name'] },
          { model: Section, attributes: ['name'] },
          { model: Kind, attributes: ['name'] },
          { model: Shape, attributes: ['name'] }
        ],
        attributes: ['id', 'UserId', 'name', 'price', 'area', 'createdAt',
          [sequelize.literal('(SELECT url FROM Photos WHERE Photos.House_id = House.id AND Photos.is_cover = true)'), 'cover'],
          [sequelize.literal('(SELECT SUM(price) FROM Expenses WHERE Expenses.House_id = House.id)'), 'extraExpenses']
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
        raw: true,
        nest: true
      })
      return cb(null, 200, { houses })
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = houseService
