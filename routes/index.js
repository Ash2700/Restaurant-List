const express = require('express')
const router = express.Router()

const restaurant = require('./routers')

router.use('/restaurants', restaurant)

router.get('/', (req, res) => {
  res.redirect('/login')
})

router.get('/login',(req, res)=>{
  res.render('login')
})

router.get('/register',(req, res)=>{
  res.render('register')
})

router.get('/logOut',(req, res)=>{
  res.send('logOuted')
})

module.exports = router
