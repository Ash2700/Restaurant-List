const express = require('express')
const router = express.Router()
const authHandler = require('../middlewares/auth-handler')

const restaurant = require('./routers')
const user = require('./user')
const passport = require('passport')


router.use('/restaurants', authHandler, restaurant)
router.use('/user', user)



router.get('/',passport.authenticate('local',{
  successRedirect: '/restaurants',
  failureRedirect: '/login',
  failureFlash: true
}))
router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }))

router.get('/oauth2/redirect/facebook', passport.authenticate('facebook', {
  successRedirect: '/restaurants',
  failureRedirect: '/login',
  failureFlash: true
}))

router.post('/login', passport.authenticate('local', {
  successRedirect: '/restaurants',
  failureRedirect: '/login',
  failureFlash: true
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/logOut', (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error)
    }
    req.flash('success', '登出成功')
    return res.redirect('/login')
  })
})

module.exports = router
