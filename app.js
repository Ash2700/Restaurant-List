const express = require('express')
const app = express()
const port = 3000

const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const routes= require('./routes')


app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(routes)



app.listen(port, () => {
  console.log(`express server is running HTTP://localhost:${port}`)
})
