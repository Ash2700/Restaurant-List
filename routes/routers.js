const express = require('express')
const router = express.Router()



const { Sequelize } = require('sequelize')
const db = require('../models')
const restaurant = db.restaurant


router.get('/', (req, res) => {
  const keyword = req.query.keyword?.trim()
  const sortSelect = req.query.select ? req.query.select : 'name'
  const sortDeration = req.query.deration ? req.query.deration : 'ASC'
  const sortPlan = haveorder(sortSelect, sortDeration)
  const matchedRestaurant = keyword
    ? filterFormDatabaseByKeyword(keyword, sortPlan)
    : findAllFormDatabase(sortPlan)

  return matchedRestaurant
    .then((restaurantSQLData) => {
      res.render('index', { restaurants: restaurantSQLData, keyword })
    })
    .catch((err) => { console.log(err) })
})


async function filterFormDatabaseByKeyword(keyword, sortBy) {
  const condition = Sequelize.Op
  return await restaurant.findAll({
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
    raw: true,
    order: [sortBy],
    where: {
      [condition.or]: [
        { name: { [condition.substring]: `${keyword}` } },
        { name_en: { [condition.substring]: `${keyword}` } },
        { category: { [condition.substring]: `${keyword}` } }
      ]
    }
  })
}

// 撈全部屬性資料出來
async function findAllFormDatabase(sortPlan) {

  return await restaurant.findAll({
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
    raw: true,
    order: [sortPlan]
  })
}
function haveorder(Select, deration) {
  const selectList = ['name', 'category', 'rating']
  const derationList = ['ASC', 'DESC']
  let sortPlan = []
  if (selectList.includes(Select) && derationList.includes(deration)) {
    return sortPlan = [`${Select}`, `${deration}`]
  } else return sortPlan = []
}
// 藉由ID找資料
async function findIdFormDatabase(id) {
  return await restaurant.findByPk(id, {
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
    raw: true
  })
}
// 新增收藏資料

router.get('/add', (req, res) => {
  const formAction = '/restaurants/add'
  res.render('favorite', { formAction })
})
// 創建新資料
router.post('/add', (req, res) => {
  const body = req.body
  return restaurant.create(body)
    .then(() => res.redirect('/restaurants'))
    .catch((err) => { console.log(err) })
})
// 顯示編輯按鈕
router.get('/edit', (req, res) => {
  const keyword = req.query.keyword?.trim()
  return findAllFormDatabase()
    .then((restaurantSQLData) => {
      res.render('index', {
        restaurants: restaurantSQLData, keyword
      })
    })
    .catch((err) => { console.log(err) })
})
// 編輯資料頁
router.get('/edit/:id', (req, res) => {
  const id = req.params.id
  const formAction = '/restaurants/edit/{{detail.id}}?_method=PUT'
  return findIdFormDatabase(id)
    .then((detail) => {
      res.render('favorite', { info: detail, formAction })
    })
    .catch((err) => { console.log(err) })
})
// 更新資料
router.put('/edit/:id', (req, res) => {
  const id = req.params.id
  const data = req.body
  return restaurant.update(data, { where: { id } })
    .then(() => res.redirect(`/restaurants/edit/:${id}`))
    .catch((err) => { console.log(err) })
})
// 刪除資料
router.delete('/edit/:id', (req, res) => {
  const id = req.params.id
  return restaurant.destroy({ where: { id } })
    .then(() => { res.redirect('/restaurants/edit') })
})
// 顯次詳細資料
router.get('/:id', (req, res) => {
  const id = req.params.id
  return findIdFormDatabase(id)
    .then((detail) => { res.render('detail', { detail }) })
    .catch((err) => { console.log(err) })
})


module.exports = router