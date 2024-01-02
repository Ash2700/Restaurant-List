const express = require('express')
const app = express()
const port = 3000

const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const { Sequelize } = require('sequelize')
const db = require('./models')
const restaurant = db.restaurant
const pageParameter = require('./public/jsons/pageParameter.json').parameter



app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
  res.redirect("/restaurants")
})
//home page
app.get('/restaurants', (req, res) => {
  const keyword = req.query.keyword?.trim();
  const matchedRestaurant = keyword ? filterFormDatabaseByKeyword(keyword)
    : findAllFormDatabase()
  return matchedRestaurant.then((restaurant_sqlData) => {
    res.render('index', {
      restaurants: restaurant_sqlData, keyword
    })
  })
    .catch((err) => { console.log(err) })
})

async function filterFormDatabaseByKeyword(keyword) {
  const Op = Sequelize.Op
  return await restaurant.findAll({
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
    raw: true,
    where: {
      [Op.or]: [
        { name: { [Op.substring]: `${keyword}` } },
        { name_en: { [Op.substring]: `${keyword}` } },
        { category: { [Op.substring]: `${keyword}` } },
      ]

    }
  })
}

//撈全部屬性資料出來
async function findAllFormDatabase() {
  return await restaurant.findAll({
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
    raw: true
  })
}
//藉由ID找資料
async function findIdFormDatabase(id) {
  return await restaurant.findByPk(id, {
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
    raw: true
  })
}
//新增收藏資料

app.get('/restaurants/add',  (req, res) => {
  const formAction = "/restaurants/add"
    res.render('favorite', { formAction })
 
})
//創建新資料
app.post('/restaurants/add', (req, res) => {
  const body = req.body
  return restaurant.create(body)
    .then(() => res.redirect('/restaurants/add'))
    .catch((err) => { console.log(err) })
})
//顯示編輯按鈕
app.get('/restaurants/edit', (req, res) => {
  const keyword = req.query.keyword?.trim();
  const display= true
  return findAllFormDatabase()
    .then((restaurant_sqlData) => {
      res.render('index', {
        restaurants: restaurant_sqlData, keyword,display
      })
    })
    .catch((err) => { console.log(err) })
})
//編輯資料頁
app.get('/restaurants/edit/:id', (req, res) => {
  const id = req.params.id
  const formAction = "/restaurants/edit/{{detail.id}}?_method=PUT"
  return findIdFormDatabase(id)
    .then((detail) => { 
      res.render('favorite', { info:detail,formAction,parameter:pageParameter }) })
    .catch((err) => { console.log(err) })
})
//更新資料
app.put('/restaurants/edit/:id', (req, res) => {
  const id = req.params.id
  const data = req.body
  return restaurant.update(data, { where: { id } })
    .then(() => res.redirect(`/restaurants/edit/:${id}`))
    .catch((err) => { console.log(err) })
})
//刪除資料
app.delete('/restaurants/edit/:id', (req, res) => {
  const id = req.params.id
  return restaurant.destroy({ where: { id } })
    .then(() => { res.redirect('/restaurants/edit') })
})

//顯次詳細資料
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return findIdFormDatabase(id)
    .then((detail) => { res.render('detail', { detail }) })
    .catch((err) => { console.log(err) })
})



app.listen(port, () => {
  console.log(`express server is running HTTP://localhost:${port}`)
})
