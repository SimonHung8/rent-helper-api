const fetch = require('node-fetch')
const HTMLParser = require('node-html-parser')
const root = require('../config/root.json')

const scrapeHelper = {
  setListHeader: async () => {
    const headers = { 'User-Agent': 'rent-helper' }
    const indexRes = await fetch(`${root.INDEX_URL}`, { headers })
    if (indexRes.status !== 200) throw new Error('爬不到資料，快來檢查一下')
    headers.cookie = indexRes.headers.raw()['set-cookie'].find(cookie => cookie.includes('591_new_session'))
    const text = await indexRes.text()
    const body = HTMLParser.parse(text)
    headers['X-CSRF-TOKEN'] = body.querySelector('meta[name="csrf-token"]').attrs.content
    return headers
  },
  setDetailHeader: async () => {
    const headers = { 'User-Agent': 'rent-helper', device: 'pc' }
    const indexRes = await fetch(`${root.INDEX_URL}`, { headers })
    // header請求失敗
    if (indexRes.status !== 200) throw new Error('爬不到資料，快來檢查一下')
    headers.deviceid = indexRes.headers.raw()['set-cookie'].find(cookie => cookie.includes('T591_TOKEN'))
    return headers
  },
  setTargetURL: (search) => {
    let targetURL = root.TARGET_URL
    targetURL += `&region=${search.region}`
    targetURL += `&section=${search.sections}`
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
    targetURL += `&rentprice=${search.minPrice},${search.maxPrice}`
    if (search.notCover) {
      targetURL += '&multiNotice=not_cover'
    }
    return targetURL
  }
}

module.exports = scrapeHelper
