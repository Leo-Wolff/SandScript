require('dotenv').config()
const express = require('express')
const app = express()
const port = 8000
const path = require('path')

// Connecting mongoDB
const { MongoClient, ServerApiVersion } = require('mongodb')
const uri = process.env.MONGODB_URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })
const dbName = 'sandscript'
client.connect()

// collections aanroepen
const db = client.db(dbName)
const users = db.collection('users')

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


// filtering in discover page
app.post('/discover', async (req, res) => {
  try {
    // checks if all elements compare to a person in the database
    const data = await users.find({}).toArray()
  
    if (data) {
      res.render('pages/discover', { data })
    } else {
      res.send('no results')
    }
  } catch (err) {
    console.log(err.stack)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})