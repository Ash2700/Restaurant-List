const express = require('express')
const app = express()
const port = 3000
const { engine } = require('express-handlebars')
const restaurants = require('./public/jsons/restaurant.json').results

app.use(express.static('public'))
app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

app.get('/', (req, res) => {
  res.redirect("/restaurantlist")
})

app.get('/restaurantlist', (req, res) => {
  res.render('index', { restaurants })
})

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  const detail = restaurants.find((items) => items.id.toString() === id
  )
  res.render('detail',{ detail:detail })
})

app.listen(port, () => {
  console.log(`express server is running HTTP://localhost:${port}`)
})