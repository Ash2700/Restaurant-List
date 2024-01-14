const express= require('express')
const router= express.Router()

const restaurant= require('./routers')

router.use('/restaurants', restaurant)

router.get('/',(req, res) =>{
    res.redirect('/restaurants')
})

module.exports = router