const express = require('express')
const router= express.Router()



const { Sequelize } = require('sequelize')
const db = require('../models')
const restaurant = db.restaurant


router.get('/', (req, res) => {
    const keyword = req.query.keyword?.trim()
    const matchedRestaurant = keyword
      ? filterFormDatabaseByKeyword(keyword)
      : findAllFormDatabase()
    return matchedRestaurant
    .then((restaurantSQLData) => {
      res.render('index', { restaurants: restaurantSQLData, keyword })
    })
      .catch((err) => { console.log(err) })
  })
  
  
  async function filterFormDatabaseByKeyword (keyword) {
    const condition = Sequelize.Op
    return await restaurant.findAll({
      attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
      raw: true,
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
  async function findAllFormDatabase () {
    return await restaurant.findAll({
      attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
      raw: true
    })
  }
  // 藉由ID找資料
  async function findIdFormDatabase (id) {
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
    const displayButton = true
    const switchDisplayModel = true
    return findAllFormDatabase()
      .then((restaurantSQLData) => {
        res.render('index', {
          restaurants: restaurantSQLData, keyword, display: displayButton, back: switchDisplayModel
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
        res.render('favorite', { info: detail, formAction, parameter: pageParameter })
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