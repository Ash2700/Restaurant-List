const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const restaurant = require('./routers')
const user = require('./user')
const db = require('../models')
const Users = db.Users


router.use('/restaurants', restaurant)
router.use('/user', user)

router.get('/', (req, res) => {
  res.redirect('/restaurants')
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/register', (req, res) => {
  res.render('register')
})



router.get('/logOut', (req, res, next) => {
  return req.logOut((error) => {
    if (error) {

      return next(error)
    }
    return res.redirect('/login')
  })
})

module.exports = router
