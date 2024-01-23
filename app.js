const express = require('express')
const app = express()
const port = 3000

const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const messageHandler = require('./middlewares/message-handler')
const errorHandler = require('./middlewares/error-handler')

if(process.env.NODE_ENV === 'development'){
  require('dotenv').config()
}
const routes = require('./routes')

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(flash())
app.use(messageHandler)
app.use(routes)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`express server is running HTTP://localhost:${port}`)
})
