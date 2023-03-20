const express = require('express')
const app = express()
const port = 8000

// set the view engine to ejs
app.set('view engine', 'ejs');

app.get('/filter', (req, res) => {
  res.render('pages/filter')
})

app.get('/', (req, res) => {
  res.send('Hello Worldgit stat!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})