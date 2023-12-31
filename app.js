const express = require('express')
const app = express()
const port = 3000
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const { Sequelize } = require('sequelize')
const db = require('./models')
const restaurant = db.restaurant

app.use(express.static('public'))
app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
  res.redirect("/restaurants")
})

app.get('/restaurants', (req, res) => {
  const keyword = req.query.keyword?.trim();
  // const matchedRestaurant = keyword ? filterRestaurants(keyword)
  //   : restaurants
  // const finalyDate = matchedRestaurant.length > 0 ? matchedRestaurant : restaurants
  
  return findAllFormDatabase().then((restaurant_sqlData) => {
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
async function findAllFormDatabase(){
  return await restaurant.findAll({
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
    raw: true
  })
}

async function findIdFormDatabase(id){
  return await restaurant.findByPk(id, {
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
    raw: true
  })
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
  const keyword = req.query.keyword?.trim();
 return findAllFormDatabase()
    .then((restaurant_sqlData) => {
      res.render('showEditButton', {
        restaurants: restaurant_sqlData, keyword
      })
    })
    .catch((err) => { console.log(err) })
})
app.get('/restaurants/edit/:id',(req, res)=>{
  const id = req.params.id
  return findIdFormDatabase(id)
    .then((detail) => { res.render('detailEdit', { detail }) })
    .catch((err) => { console.log(err) })
})

app.put('/restaurants/edit/:id',(req,res)=>{
  const id = req.params.id
  const data= req.body
  return restaurant.update(data,{where:{id}})
  .then(()=> res.redirect(`/restaurants/edit/:${id}`))
  .catch((err)=>{console.log(err)})
})

app.delete('/restaurants/edit/:id',(req, res)=>{
  const id = req.params.id
  return restaurant.destroy({where:{id}})
  .then(()=>{res.redirect('/restaurants/edit')})
})

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return findIdFormDatabase(id)
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
