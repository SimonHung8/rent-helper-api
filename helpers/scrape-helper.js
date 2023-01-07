const cron = require('node-cron')
const HTMLParser = require('node-html-parser')
const fetch = require('node-fetch')
const root = require('../config/root.json')
const { User, Search } = require('../models')
const notifyHelper = require('./notify-helper')

module.exports = async () => {
  let searches = await Search.findAll()
  cron.schedule('*/15 * * * *', async () => {
    searches = await Search.findAll()
  })
  for (let i = 0; i < searches.length; i++) {
    cron.schedule('*/10 * * * *', async () => {
      try {
        // 設定header
        const search = searches[i]
        const headers = { 'User-Agent': 'rent-helper' }
        const indexRes = await fetch(`${root.INDEX_URL}`, { headers })
        // header請求失敗
        if (indexRes.status !== 200) throw new Error('爬不到資料，快來檢查一下')

        headers.cookie = `urlJumpIp=${search.region};`
        if (search.region === 1) {
          headers.cookie += `urlJumpIpByTxt=${encodeURI('台北市')};`
        }
        if (search.region === 3) {
          headers.cookie += `urlJumpIpByTxt=${encodeURI('新北市')};`
        }
        headers.cookie += indexRes.headers.raw()['set-cookie'].find(cookie => cookie.includes('591_new_session'))
        const text = await indexRes.text()
        const body = HTMLParser.parse(text)
        headers['X-CSRF-TOKEN'] = body.querySelector('meta[name="csrf-token"]').attrs.content
        // 設定要請求的網址
        let targetURL = root.TARGET_URL
        targetURL += `&region=${search.region}`
        targetURL += `&section=${search.sections.replaceAll(';', ',')}`
        if (search.kind) {
          targetURL += `&kind=${search.kind}`
        }
        if (search.shape) {
          targetURL += `&shape=${search.shape}`
        }
        if (search.keyword) {
          targetURL += `&keywords=${encodeURI(search.keyword)}`
        }
        targetURL += `&area=${search.minArea},${search.maxArea}`
        targetURL += `&rentprice=${search.minPrice}, ${search.maxPrice}`
        if (search.notCover) {
          targetURL += '&multiNotice=not_cover'
        }
        // 請求
        const targetRes = await fetch(targetURL, { headers })
        // 請求失敗
        if (targetRes.status !== 200) throw new Error('爬不到資料，快來檢查一下')

        // 結果是否與上次相同
        const originalResults = search.results.split(';')
        const targetData = await targetRes.json()
        const newResults = targetData.data.data.map(item => item.post_id)
        if (!newResults.length) return

        // 更新資料庫
        await search.update({ results: newResults.join(';') })

        // 發送line通知
        const user = await User.findOne({
          where: {
            UserId: search.UserId
          },
          attributes: ['token'],
          raw: true
        })
        const notifyResults = newResults.filter(item => !originalResults.includes(item))
        await notifyHelper(notifyResults, user.token)
      } catch (err) {
        console.error(err)
      }
    })
  }
}
