const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const restaurant = require('./routers')
const user = require('./user')
const db = require('../models')
const Users = db.Users

const passport = require('passport')
const LocalStrategy = require('passport-local')
const authHandler = require('../middlewares/auth-handler')

passport.use(new LocalStrategy({ usernameField: 'email' },
  async (username, password, done) => {
    try {

      const user = await Users.findOne({
        attritebus: ['id', 'name', 'password', 'email'],
        where: { email: username },
        raw: true
      })
      if (!user) {
        return done(null, false, { message: 'email錯誤' })
      }
      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return done(null, false, { message: '密碼錯誤' })
      }

      return done(null, user)
    } catch (error) {
      error.errorMessage = '登入失敗'
    }
  }))
passport.serializeUser((user, done) => {
  const { id, name, email } = user
  return done(null, { id, name, email })
})
passport.deserializeUser((user,done)=>{
  done(null,{id:user.id})
})


router.use('/restaurants',authHandler, restaurant)
router.use('/user', user)

router.get('/', (req, res) => {
  res.redirect('/login')
})

router.get('/login', (req, res) => {
  res.render('login')
})

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
    return res.redirect('/login')
  })
})

module.exports = router
