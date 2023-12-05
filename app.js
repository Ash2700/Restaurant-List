const express = require('express')
const app = express()
const port = 3000
const {engine} = require('express-handlebars')

app.use(express.static('public'))
app.engine('.hbs',engine({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')

app.get ( '/', (req, res) =>{
  res.redirect ("/restaurantlist")
})

app.get( '/restaurantlist' ,(req, res)=> {
  res.render('index')
})

app.get('/restaurantlist/:id', (req, res) => {
  const id =req.params.id
  res.send(`read movie :${id}`)
})

app.listen( port ,()=>{
  console.log( `express server is running HTTP://localhosting:${port}`)
})