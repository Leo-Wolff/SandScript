require('dotenv').config()
const express = require('express')
const app = express()
const port = 8000
const path = require('path')
const cookieParser = require('cookie-parser')

// Connecting mongoDB
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const uri = process.env.MONGODB_URI
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
})
const dbName = 'sandscript'
client.connect()

// collections aanroepen
const db = client.db(dbName)
const users = db.collection('users')

// set the view engine to ejs
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '/static')))
app.use(cookieParser())

// Matches page
app.get('/matches', (req, res) => {
	res.render('pages/matches')
})

// index page
app.get('/', async (req, res) => {
	res.render('pages/index')
})

// discover page
app.get('/discover', async (req, res) => {
	try {
		const filters = req.cookies.selectedFilters
			? JSON.parse(req.cookies.selectedFilters)
			: {} // get filters from cookie 

		const eersteMatch = await users.findOne({ ...filters, status: 'new' }) // use filters to search for a match

		res.render('pages/gefiltered', { eersteMatch }) // Render the page with the first match
	} catch (err) {
		console.log(err.stack)
	}
})

// filtering in discover page
app.post('/discover', async (req, res) => {
	try {
		const filters = { gender: req.body.gender } // save selected filter in object // set cookie with selected filters

		res.cookie('selectedFilters', JSON.stringify(filters)) // checks if all elements compare to a person in the database

		const eersteMatch = await users.findOne({
			gender: req.body.gender,
			status: 'new',
		}) // Search for a person with status new
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
		// const eersteMatch = await users.findOne( { status: 'new' } ) // Search for a person with status new

		const eersteMatch = await users.findOne({
			_id: new ObjectId(req.body.matchId),
		}) // Search for a person with status new

		console.log(eersteMatch)

		console.log(req.body.matchId)

		await users.updateOne(
			{ _id: eersteMatch._id },

			{ $set: { status: 'liked' } }
		)

		res.redirect('/discover')
	} catch (err) {
		console.log(err.stack)
	}
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
