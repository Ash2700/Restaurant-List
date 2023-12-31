const express = require('express')
const app = express()
const port = 3000
const { engine } = require('express-handlebars')
// const restaurants = require('./public/jsons/restaurant.json').results
const { Sequelize } = require('sequelize')
const db = require('./models')
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
  // const matchedRestaurant = keyword ? filterRestaurants(keyword)
  //   : restaurants
  // const finalyDate = matchedRestaurant.length > 0 ? matchedRestaurant : restaurants
  return restaurant.findAll({
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
    raw: true
  })
    .then((restaurant_sqlData) => {
      res.render('index', {
        restaurants: restaurant_sqlData, keyword
      })
    })
    .catch((err) => { console.log(err) })
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
const getCategoriesFormDatabase = async () => {
  try {
    const data = Object.values(await restaurant.findAll({ attributes: ['category'], raw: true }))
    return data.map((item) => item.category)    
  } catch (error) {
    console.error('發生錯誤', error)
    throw error
  }
}
const getUniqueCategories = async()=>{
  try{
    const categoriesArray = await getCategoriesFormDatabase();
    const uniqueArray =[...new Set(categoriesArray)];
    return uniqueArray;
  } catch(error){
    console.error('發生錯誤',error);
    throw error;
  }
}

app.get('/restaurants/add', async(req, res) => {
  try{
    const categories =  await getUniqueCategories()
    console.log(categories)
    res.render('favorite',{categories:categories})
  }catch(error){
    console.error('發生錯誤',error)
  }
  
})
app.get('/restaurants/edit',(req,res)=>{

})
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return restaurant.findByPk(id, {
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
    raw: true
  })
    .then((detail) => { res.render('detail', { detail }) })
    .catch((err) => { console.log(err) })
})

app.post('/restaurants', (req, res) => {
  const body= req.body
  return restaurant.create(body)
  .then(()=>res.redirect('/restaurants/add'))
  .catch((err)=>{console.log(err)})
})


app.listen(port, () => {
  console.log(`express server is running HTTP://localhost:${port}`)
})
