const fetch = require('node-fetch')
const root = require('../config/root.json')

module.exports = async (results, token) => {
  try {
    const message = results.map(result => root.HOME_URL + result).join('\n')
    await fetch('https://notify-api.line.me/api/notify', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`
      },
      body: `message=有新的物件囉!${message}`,
      method: 'POST'
    })
  } catch (err) {
    console.error(err)
  }
}
