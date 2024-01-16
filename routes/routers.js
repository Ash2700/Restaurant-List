const express = require('express')
const router = express.Router()



const { Sequelize } = require('sequelize')
const db = require('../models')
const restaurant = db.restaurant


router.get('/', (req, res, next) => {
  const keyword = req.query.keyword?.trim()
  const sortSelect = req.query.select ? req.query.select : 'name'
  const sortDeration = req.query.deration ? req.query.deration : 'ASC'
  const sortPlan = isSortPlan(sortSelect, sortDeration)
  const matchedRestaurant = keyword
    ? filterFormDatabaseByKeyword(keyword, sortPlan)
    : findAllFormDatabase(sortPlan)

  return matchedRestaurant
    .then((restaurantSQLData) => {
      res.render('index', { restaurants: restaurantSQLData, keyword })
    })
    .catch((error) => {
      error.errorMessage = '伺服器出錯'
      next(error)
    })
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
function isSortPlan(Select, deration) {
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

router.get('/add', (req, res, next) => {
  const formAction = '/restaurants/add'
  res.render('favorite', { formAction })
})
// 創建新資料
router.post('/add', (req, res, next) => {
  const body = req.body
  return restaurant.create(body)
    .then(() => {
      req.flash('success', '新增成功')
      res.redirect('/restaurants')
    })
    .catch((error) => {
      error.errorMessage = '新增失敗'
      next(error)
    })
})

// 編輯資料頁
router.get('/edit/:id', (req, res, next) => {
  const id = req.params.id
  const formAction = '/restaurants/edit/{{detail.id}}?_method=PUT'
  return findIdFormDatabase(id)
    .then((detail) => {
      res.render('favorite', { info: detail, formAction })
    })
    .catch((error) => { error.errorMessage = '伺服器出錯'
    next(error) })
})
// 更新資料
router.put('/edit/:id', (req, res) => {
  const id = req.params.id
  const data = req.body
  return restaurant.update(data, { where: { id } })
    .then(() => {
      req.flash('success', '更新成功')
      res.redirect(`/restaurants`)
    })
    .catch((error) => {
      error.errorMessage = '更新失敗'
      next(error)
    })
})
// 刪除資料
router.delete('/edit/:id', (req, res, next) => {
  const id = req.params.id
  return restaurant.destroy({ where: { id } })
    .then(() => { 
      req.flash('success','刪除成功')
      res.redirect('/restaurants') })
    .catch((error)=>{
      error.errorMessage = '刪除失敗'
      next(error)
    })
})
// 顯次詳細資料
router.get('/:id', (req, res, next) => {
  const id = req.params.id
  return findIdFormDatabase(id)
    .then((detail) => { res.render('detail', { detail }) })
    .catch((err) => {
      error.errorMessage = '伺服器出錯'
      next(error)
    })
})


module.exports = router