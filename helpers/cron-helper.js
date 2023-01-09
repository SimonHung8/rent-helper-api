const cron = require('node-cron')
const fetch = require('node-fetch')
const { User, Search } = require('../models')
const notifyHelper = require('./notify-helper')
const scrapeHelper = require('./scrape-helper')

module.exports = async () => {
  cron.schedule(process.env.FREQUENCY, async () => {
    try {
      const searches = await Search.findAll()
      console.log(searches.length)
      if (!searches.length) return
      for (const search of searches) {
        console.log(search.name)
        // 設定header
        console.log('setting header')
        const headers = await scrapeHelper.setListHeader()
        console.log('setting header done')
        headers.cookie += `;urlJumpIp=${search.region};`
        if (search.region === 1) {
          headers.cookie += `urlJumpIpByTxt=${encodeURI('台北市')};`
        }
        if (search.region === 3) {
          headers.cookie += `urlJumpIpByTxt=${encodeURI('新北市')};`
        }
        // 設定要請求的網址
        const targetURL = scrapeHelper.setTargetURL(search)
        console.log('fetching')
        const targetRes = await fetch(targetURL, { headers })
        console.log('fetch done')
        // 請求失敗
        if (targetRes.status !== 200) throw new Error('爬不到資料，快來檢查一下')

        // 結果是否與上次相同
        const targetData = await targetRes.json()
        const originalResults = search.results.split(',').map(item => Number(item))
        const newResults = targetData.data.data.map(item => item.post_id)
        const differentResults = newResults.filter(item => !originalResults.includes(item))
        console.log('differentResults')
        console.log(differentResults)
        if (!differentResults.length) return
        // 更新資料庫
        console.log('updating database')
        await search.update({ results: newResults.join(',') })
        console.log('update done')
        // 發送line通知
        const user = await User.findByPk(search.UserId, {
          attributes: ['token'],
          raw: true
        })
        if (!user) return
        console.log('sending line')
        await notifyHelper(search.name, differentResults, user.token)
        console.log('see line')
      }
    } catch (err) {
      console.error(err)
    }
  })
}
