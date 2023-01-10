if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const routes = require('./routes')
const cors = require('cors')
const cronStart = require('./helpers/cron-helper')
const { errorHandler, undefinedRoutes } = require('./middleware/error-handler')

const app = express()

app.use(cors({ origin: ['http://localhost:3000', process.env.FRONTEND_ORIGIN] }))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api', routes)
app.use(errorHandler)
app.use('*', undefinedRoutes)

app.listen(process.env.PORT, () => console.log('Rent Helper starts'))

// cronStart()
