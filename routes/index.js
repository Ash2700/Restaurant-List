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

router.post('/register',(req, res)=>{
  const {name, email, password, confirmPassword}=req.body
  if(!email || !password){
    req.flash('error','email或密碼為必填')
    return res.redirect('back')
  }
  if(password !== confirmPassword){
    req.flash('error','驗證密碼和密碼需相同')
    return res.redirect('back')
  }
})

router.get('/logOut',(req, res)=>{
  res.send('logOuted')
})

module.exports = router
