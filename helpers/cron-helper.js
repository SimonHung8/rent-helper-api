const cron = require('node-cron')
const fetch = require('node-fetch')
const { User, Search, Region } = require('../models')
const notifyHelper = require('./notify-helper')
const scrapeHelper = require('./scrape-helper')

module.exports = async () => {
  cron.schedule(process.env.FREQUENCY, async () => {
    try {
      const searches = await Search.findAll()
      const regions = await Region.findAll({ raw: true })
      if (!searches.length) return
      for (const search of searches) {
        // 設定header
        const headers = await scrapeHelper.setListHeader()
        headers.cookie += `;urlJumpIp=${search.region};`
        const regionName = regions.find(region => region.externalId === search.region).name
        headers.cookie += `urlJumpIpByTxt=${encodeURI(regionName)};`
        // 設定要請求的網址
        const targetURL = scrapeHelper.setTargetURL(search)
        const targetRes = await fetch(targetURL, { headers })
        // 請求失敗
        if (targetRes.status !== 200) throw new Error('爬不到資料，快來檢查一下')

        // 結果是否與上次相同
        const targetData = await targetRes.json()
        const originalResults = search.results.split(',').map(item => Number(item))
        const newResults = targetData.data.data.map(item => item.post_id).slice(0, originalResults.length)
        const differentResults = newResults.filter(item => !originalResults.includes(item))
        if (differentResults.length) {
          // 更新資料庫
          await search.update({ results: newResults.join(',') })
          // 發送line通知
          const user = await User.findByPk(search.UserId, {
            attributes: ['token'],
            raw: true
          })
          if (user) {
            await notifyHelper(search.name, differentResults, user.token)
          }
        }
      }
    } catch (err) {
      console.error(err)
    }
  })
}
