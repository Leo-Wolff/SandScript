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

app.get('/discover', async (req, res) => {
  try{
    const eersteMatch = await users.findOne( { status: 'new'} )  // Search for a person with status new

    res.render('pages/gefiltered', { eersteMatch }) // Render the page with the first match
  } catch (err) {
    console.log(err.stack)
  }
})

app.get('/', async (req, res) => {
  res.render('pages/index')
})


// filtering in discover page
app.post('/discover', async (req, res) => {
  try {
    // checks if all elements compare to a person in the database
    const eersteMatch = await users.findOne({ gender: req.body.gender }, { status: 'new' } )  // Search for a person with status new
  
    if (eersteMatch) {
      res.render('pages/gefiltered', { eersteMatch })

    } else {
      res.send('no results')
    }
  } catch (err) {
    console.log(err.stack)
  }
})

app.post('/liked', async (req, res) => {
  try {
    const eersteMatch = await users.findOne( { status: 'new' } ) // Search for a person with status new

    await users.updateOne(
      { _id: eersteMatch._id },
      { $set: { status: 'liked' } }
    )

    res.redirect('/discover')

  } catch(err){
    console.log(err.stack)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})