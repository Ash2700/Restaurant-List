const express = require('express')
const router = express.Router()

const { Sequelize } = require('sequelize')
const db = require('../models')
const restaurant = db.restaurant

router.get('/', (req, res, next) => {
  const userId = req.user.id
  const keyword = req.query.keyword?.trim()
  const sortSelect = req.query.select
  const sortDeration = req.query.deration
  const sortPlan = isSortPlan(sortSelect, sortDeration)

  const matchedRestaurant =
    filterFormDatabaseByKeyword(keyword, sortPlan, userId)


  return matchedRestaurant
    .then((restaurantSQLData) => {
      res.render('index', { restaurants: restaurantSQLData, keyword })
    })
    .catch((error) => {
      error.errorMessage = '伺服器出錯'
      next(error)
    })
})

async function filterFormDatabaseByKeyword(keyword, sortPlan, userId) {

  return await restaurant.findAll({
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description', 'userID'],
    raw: true,
    order: sortPlan,
    where: [{ userID: userId },
    addSearchWord(keyword)
    ]
  })
}

function addSearchWord(keyword) {
  let searchCondition = {}
  const condition = Sequelize.Op
  if (keyword) {
    return searchCondition = {
      [condition.or]: [
        { name: { [condition.substring]: `${keyword}` } },
        { name_en: { [condition.substring]: `${keyword}` } },
        { category: { [condition.substring]: `${keyword}` } }
      ]
    }
  }
  return searchCondition = {}
}


function isSortPlan(Select, deration) {
  const select = Select ? Select : 'name'
  const Deration = deration ? deration : 'ASC'
  const selectList = ['name', 'category', 'rating']
  const derationList = ['ASC', 'DESC']
  let sortPlan = []
  if (selectList.includes(Select) && derationList.includes(deration)) {
    return sortPlan = [[`${select}`, `${Deration}`]]
  } return sortPlan = []
}
// 藉由ID找資料
async function findIdFormDatabase(id, isRawTrue) {
  return await restaurant.findByPk(id, {
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description', 'userID'],
    raw: isRawTrue
  })
}
// 新增收藏資料
router.get('/add', (req, res, next) => {
  const formAction = '/restaurants/add'
  res.render('favorite', { formAction })
})
// 創建新資料
router.post('/add', (req, res, next) => {
  const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
  const userID = req.user.id
  return restaurant.create({ name, name_en, category, image, location, phone, google_map, rating, description, userID: userID })
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
  const formAction = `/restaurants/edit/${id}?_method=PUT`
  const isRawTrue = true
  const userID = req.user.id
  return findIdFormDatabase(id, isRawTrue)
    .then((detail) => {
      if (!detail) {
        req.flash('error', '找不到資料')
        return res.redirect('/restaurants')
      }
      if (detail.userID !== userID) {
        req.flash('error', '權限不足')
        return res.redirect('/restaurants')
      }
      res.render('favorite', { info: detail, formAction })
    })
    .catch((error) => {
      error.errorMessage = '伺服器出錯'
      next(error)
    })
})
// 更新資料
router.put('/edit/:id', (req, res, next) => {
  const id = req.params.id
  const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
  const userID = req.user.id
  const isRawTrue = false
  return findIdFormDatabase(id, isRawTrue)
    .then((data) => {
      if (!data) {
        req.flash('error', '找不到資料')
        return res.redirect('/restaurants')
      }
      if (data.userID !== userID) {
        req.flash('error', '權限不足')
        return res.redirect('/restaurants')
      }
      return data.update({ name, name_en, category, image, location, phone, google_map, rating, description, userID: userID }, { where: { id } })
        .then(() => {
          req.flash('success', '更新成功')
          res.redirect('/restaurants')
        })
    })
    .catch((error) => {
      error.errorMessage = '更新失敗'
      next(error)
    })
})
// 刪除資料
router.delete('/edit/:id', (req, res, next) => {
  const id = req.params.id
  const userID = req.user.id
  const isRawTrue = false
  return findIdFormDatabase(id, isRawTrue)
    .then((data) => {
      if (!data) {
        req.flash('error', '找不到資料')
        return res.redirect('/restaurants')
      }
      if (data.userID !== userID) {
        req.flash('error', '權限不足')
        return res.redirect('/restaurants')
      }
      return data.destroy({ where: { id } })
        .then(() => {
          req.flash('success', '刪除成功')
          res.redirect('/restaurants')
        })
        .catch((error) => {
          error.errorMessage = '刪除失敗'
          next(error)
        })
    })
})
// 顯次詳細資料
router.get('/:id', (req, res, next) => {
  const id = req.params.id
  const isRawTrue = true
  const userID = req.user.id
  return findIdFormDatabase(id, isRawTrue)
    .then((detail) => {
      if (!detail) {
        req.flash('error', '找不到資料')
        return res.redirect('/restaurants')
      }
      if (detail.userID !== userID) {
        req.flash('error', '權限不足')
        return res.redirect('/restaurants')
      }
      res.render('detail', { detail })
    })
    .catch((error) => {
      error.errorMessage = '伺服器出錯'
      next(error)
    })
})

module.exports = router
