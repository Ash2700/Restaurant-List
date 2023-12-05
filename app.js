const express = require('express')
const app = express()
const port = 3000

app.get ( '/', (req, res) =>{
  res.redirect ("/restaurantlist")
})

app.get( '/restaurantlist' ,(req, res)=> {
  res.send('what do u want')
})

app.get('/restaurantlist/:id', (req, res) => {
  const id =req.params.id
  res.send(`read movie :${id}`)
})

app.listen( port ,()=>{
  console.log( `express server is running HTTP://localhosting:${port}`)
})