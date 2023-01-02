if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const routes = require('./routes')
const { errorHandler, undefinedRoutes } = require('./middleware/error-handler')

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api', routes)
app.use(errorHandler)
app.use('*', undefinedRoutes)

app.listen(3000, () => console.log('Rent Helper starts'))
