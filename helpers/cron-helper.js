const cron = require('node-cron')
const fetch = require('node-fetch')
const { User, Search } = require('../models')
const notifyHelper = require('./notify-helper')
const scrapeHelper = require('./scrape-helper')

module.exports = async () => {
  let searches = await Search.findAll()
  cron.schedule('*/15 * * * *', async () => {
    searches = await Search.findAll()
  })
  for (let i = 0; i < searches.length; i++) {
    cron.schedule('*/10 * * * *', async () => {
      try {
        const search = searches[i]
        // 設定header
        const headers = await scrapeHelper.setListHeader()
        headers.cookie += `;urlJumpIp=${search.region};`
        if (search.region === 1) {
          headers.cookie += `urlJumpIpByTxt=${encodeURI('台北市')};`
        }
        if (search.region === 3) {
          headers.cookie += `urlJumpIpByTxt=${encodeURI('新北市')};`
        }

        // 設定要請求的網址
        const targetURL = scrapeHelper.setTargetURL(search)
        const targetRes = await fetch(targetURL, { headers })
        // 請求失敗
        if (targetRes.status !== 200) throw new Error('爬不到資料，快來檢查一下')

        // 結果是否與上次相同
        const originalResults = search.results.split(',')
        const targetData = await targetRes.json()
        const newResults = targetData.data.data.map(item => item.post_id)
        const differentResults = newResults.filter(item => !originalResults.includes(item))
        if (!differentResults.length) return

        // 更新資料庫
        await search.update({ results: newResults.join(',') })

        // 發送line通知
        const user = await User.findByPk(search.UserId, {
          attributes: ['token'],
          raw: true
        })
        await notifyHelper(differentResults, user.token)
      } catch (err) {
        console.error(err)
      }
    })
  }
}
