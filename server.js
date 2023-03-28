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

		const eersteMatch = await users.findOne({ ...filters, likes: { $nin: ["MysteryMan4"]}, status: 'new' }) // filter between the selcted filters and status new

		res.render('pages/gefiltered', { eersteMatch }) // Render the page with the first match
	} catch (err) {
		console.log(err.stack)
	}
})

// filtering in discover page
app.post('/discover', async (req, res) => {
	try {
		const filters = { gender: req.body.gender } // save input from user in filters

		res.cookie('selectedFilters', JSON.stringify(filters)) // save filters in cookie

		const eersteMatch = await users.findOne({
			gender: req.body.gender,
			likes: { $nin: ["MysteryMan4"]},
      status: 'new'
		}) // Search for a person, where the user has selected input via the seqrch form

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
		const eersteMatch = await users.findOne({
			_id: new ObjectId(req.body.matchId)
		}) // Search for a person with status new

		console.log(eersteMatch)
		console.log(req.body.matchId)

		await users.updateOne(
			{ _id: eersteMatch._id },
			{ $set: { status: 'liked' } }
		)
    
    await users.updateOne(
			{ _id: eersteMatch._id },
			{ $push: { likes: 'req.cookies.username' } }
		)// Update the status of the person to liked and add the logged-in user's username to their likes list

		res.redirect('/discover')
	} catch (err) {
		console.log(err.stack)
	}
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
