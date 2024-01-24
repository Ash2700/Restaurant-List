
if(process.env.NODE_ENV === 'development'){
  require('dotenv').config()
}
const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const app = express()
const port = 3000

const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const messageHandler = require('./middlewares/message-handler')
const errorHandler = require('./middlewares/error-handler')
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
app.use(passport.initialize())
app.use(passport.session())
app.use(messageHandler)
app.use(routes)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`express server is running HTTP://localhost:${port}`)
})
