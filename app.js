const express = require('express')
const app = express()
const port = 3000
const { engine } = require('express-handlebars')
const restaurants = require('./public/jsons/restaurant.json').results
const {Sequelize} = require('sequelize')
const db =require('./models')
const restaurant = db.restaurant

app.use(express.static('public'))
app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.redirect("/restaurants")
})

app.get('/restaurants', (req, res) => {
  const keyword = req.query.keyword?.trim();
  const matchedRestaurant = keyword ? filterRestaurants(keyword)
    : restaurants
  const finalyDate = matchedRestaurant.length > 0 ? matchedRestaurant : restaurants
  res.render('index', { restaurants: finalyDate, keyword })
})

function filterRestaurants(keyword) {
  return restaurants.filter((items) =>
    Object.keys(items).some((property) => {
      if (property === 'name' || property === 'name_en' || property === 'category') {
        return items[property].toLowerCase().includes(keyword.toLowerCase())
      }
      return false
    })
  )
}

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  const detail = restaurants.find((items) => items.id.toString() === id
  )
  res.render('detail', { detail })
})

const categories = restaurants.map(item => item.category)

app.get('/restaurants/add', (req, res) => {
  res.render('favorite', { categories })
})

app.post('/submitRestaurantData', (req, res, next) => {
  const { name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    description } = req.body
  const id = restaurants.length + 1
  const newRestaurant = {
    id,
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    description
  };
  restaurants.push(newRestaurant)
  console.log(newRestaurant)
  res.redirect('/addFavorite')
})


app.listen(port, () => {
  console.log(`express server is running HTTP://localhost:${port}`)
})
