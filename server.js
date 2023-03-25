const express = require("express")
const app = express()
const port = 8000
const path = require('path')
const User = require("./models/User")

// set the view engine to ejs
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '/static')))

app.get('/matches', (req, res) => {
  res.render('pages/matches')
})
app.get('/discover', (req, res) => {
  res.render('pages/discover')
})

app.get('/', (req, res) => {
  res.render('pages/index')
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
