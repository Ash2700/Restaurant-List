const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const restaurant = require('./routers')
const user = require('./user')
const db = require('../models')
const Users = db.Users

const passport = require('passport')
const LocalStrategy = require('passport-local')
const FacebookStrategy= require('passport-facebook')
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
  
passport.use(new FacebookStrategy({
  clientID:process.env.FACEBOOK_CLIENT_ID,
  clientSecret:process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL:process.env.FACEBOOK_CALLBACK_URL,
  profileFields:['email', 'displayName']
},(accessToken, refreshToken, profile, done)=>{
    const email =profile.emails[0].value
    const name=profile.displayName
    return Users.findOne({
      attributes:['id','name','email'],
      where:{email},
      raw:true
    })
    .then((user)=>{
      if(user) return done(null, user)
      const randomPwd= Math.random().toString(36).slice(-8)
    return bcrypt.hash(randomPwd,10)
    .then((hash)=> Users.create({name,email,password:hash}))
    .then((user)=>done(null,{id:user.id, name:user.name, email:user.email}))
    })
    .catch((error)=>{
      error.errorMessage='登入失敗'
      done(error)
    })
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

router.get('/login/facebook',passport.authenticate('facebook',{scope:['email']}))

router.get('/oauth2/redirect/facebook',passport.authenticate('facebook',{
  successRedirect:'/restaurants',
  failureRedirect:'/login',
  failureFlash:true
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
    req.flash('success','登出成功')
    return res.redirect('/login')
  })
})

module.exports = router
