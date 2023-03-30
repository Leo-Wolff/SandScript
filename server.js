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
app.get('/matches', async (req, res) => {
	// const eersteMatch = await users.findOne({ ...filters, likes: { $nin: ["MysteryMan4"]}, status: 'new' }) // filter between the selcted filters and status new
	
	res.render('pages/matches', { eersteMatch })
})

// index page
app.get('/', async (req, res) => {
	try{
	res.render('pages/index')

	} catch(err) {
		console.log(err.stack)
	}
})

// discover page
app.get('/discover', async (req, res) => {
	try {
		const filters = req.cookies.selectedFilters
			? JSON.parse(req.cookies.selectedFilters)
			: {} // get filters from cookie 

			const ik = await users.findOne({username: 'MysteryMan4'})
			const eersteMatch = await users.findOne({...filters, username: { $nin: ik.likes, $not: {$eq: ik.username} }, status: 'new'})

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

		const ik = await users.findOne({username: 'MysteryMan4'})
		const eersteMatch = await users.findOne({...filters, username: { $nin: ik.likes, $not: {$eq: ik.username} }, status: 'new'})

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

		const ik = await users.findOne({username: 'MysteryMan4'})
		console.log(eersteMatch)


		await users.updateOne(
			{ _id: ik._id },
			{ $push: { likes: eersteMatch.username } }
		)

		await users.updateOne(
			{ _id: eersteMatch._id },
			{ $push: { likedBy: ik.username } }
		)

		ik.likes.push(eersteMatch.username)
		eersteMatch.likedBy.push(ik.username)

		// console.log(eersteMatch)
		// console.log(ik)

		// console.log(ik.likes.includes(eersteMatch.username)) 
		// console.log(ik.likedBy.includes(eersteMatch.username))

		if (ik.likes.includes(eersteMatch.username) && ik.likedBy.includes(eersteMatch.username)) {
			console.log('match')
		} else {
			console.log('geen match')
		}

	} catch (err) {
		console.log(err.stack)
	}
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
