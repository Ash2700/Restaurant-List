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
  res.redirect("/restaurantList")
})

app.get('/restaurantList', (req, res) => {
  const keyword = req.query.keyword?.trim();
  const matchedRestaurant = keyword ? restaurants.filter((items) =>
    Object.values(items).some((property) => {
      if (typeof property === 'string') {
        return property.toLowerCase().includes(keyword.toLowerCase())
      }
      return false
    })
  ) : restaurants
  const finalyDate = matchedRestaurant.length > 0 ? matchedRestaurant:restaurants
  res.render('index', { restaurants: finalyDate, keyword })
})


app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  const detail = restaurants.find((items) => items.id.toString() === id
  )
  res.render('detail', { detail })
})

app.listen(port, () => {
  console.log(`express server is running HTTP://localhost:${port}`)
})
