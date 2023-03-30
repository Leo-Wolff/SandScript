require("dotenv").config()
const express = require("express")
const app = express()
const port = 8000
const path = require("path")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const bodyParser = require("body-parser")

// Connecting mongoDB
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb")

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const uri = process.env.MONGODB_URI
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
})

const dbName = "sandscript"

// collections aanroepen
const db = client.db(dbName)
const users = db.collection("users")

async function connectToDatabase() {
	try {
		console.log("Connecting to MongoDB Atlas cluster...")
		await client.connect()
		console.log("Successfully connected to MongoDB Atlas!")
		return client
	} catch (error) {
		console.error("Connection to MongoDB Atlas failed!", error)
		process.exit()
	}
}

connectToDatabase()

function getDataFromDatabase(dbCollection) {
	const db = client.db(dbName)
	let collection = db.collection(dbCollection) // collectie naam
	collection = GetDraftsFromDatabase(collection)

	return collection
}

async function GetDraftsFromDatabase(collection) {
	return collection.find().toArray()
}

async function CreateNewDraft(collection, content, input) {
	const draft = {
		text: content,
		signed: input,
		dateUpdated: new Date().toISOString().slice(0, 10), // oorspronkelijk date is handiger voor aanpassen later
	}

	await collection.insertOne(draft)
}

// set the view engine to ejs
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, "/static")))
app.use(cookieParser())

//Session
app.set("trust proxy", 1)
app.use(
	session({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: true,
		cookie: {},
	})
)
//Login page
app.post("/uitloggen", (req, res) => {
	req.session.destroy()
	res.redirect("/inloggen")
})
app.get("/inloggen", (req, res) => {
	res.render("inloggen")
})
app.post("/inloggen", async (req, res) => {
	const currentUser = await users.findOne({
		username: req.body.username,
	})
	req.session.user = {
		username: currentUser.username,
		password: currentUser.password,
		email: currentUser.email,
	}
	res.redirect("/account")
})
//Profile page
app.get("/account", async (req, res) => {
	const { username, email } = req.session.user
	res.render("account", {
		username: username,
		email: email,
	})
})
app.post("/update", async (req, res) => {
	await users.findOneAndUpdate(
		{
			username: req.session.user.username,
		},
		{
			$set: {
				username: req.body.username,
				email: req.body.email,
			},
		}
	)
	req.session.user.username = req.body.username
	req.session.user.email = req.body.email
	res.redirect("/account")
})
// Matches page
app.get("/matches", async (req, res) => {
	// const eersteMatch = await users.findOne({ ...filters, likes: { $nin: ["MysteryMan4"]}, status: 'new' }) // filter between the selcted filters and status new

	let draft = await getDataFromDatabase("letters")
	res.render("pages/matches", {
		letters: draft,
	})
})

// index page
app.get("/", async (req, res) => {
	try {
		res.render("pages/index")
	} catch (err) {
		console.log(err.stack)
	}
})

app.get("/letter", (req, res) => {
	res.render("pages/letter")
})

app.get("/bottle", (req, res) => {
	res.render("pages/bottle")
})

app.post("/bottle", (req, res) => {
	const db = client.db(dbName)
	const collectionLetters = db.collection("letters")
	CreateNewDraft(collectionLetters, req.body.content, req.body.signed)
	res.render("pages/bottle")
})

// discover page
app.get("/discover", async (req, res) => {
	try {
		const filters = req.cookies.selectedFilters
			? JSON.parse(req.cookies.selectedFilters)
			: {} // get filters from cookie

		const ik = await users.findOne({ username: "MysteryMan2" })
		const eersteMatch = await users.findOne({
			...filters,
			username: { $nin: ik.likes, $not: { $eq: ik.username } },
			status: "new",
		})

		res.render("pages/gefiltered", { eersteMatch }) // Render the page with the first match
	} catch (err) {
		console.log(err.stack)
	}
})

// filtering in discover page
app.post("/discover", async (req, res) => {
	try {
		const filters = { gender: req.body.gender } // save input from user in filters

		res.cookie("selectedFilters", JSON.stringify(filters)) // save filters in cookie

		const ik = await users.findOne({ username: "MysteryMan2" })
		const eersteMatch = await users.findOne({
			...filters,
			username: { $nin: ik.likes, $not: { $eq: ik.username } },
			status: "new",
		})

		if (eersteMatch) {
			res.render("pages/gefiltered", { eersteMatch })
		} else {
			res.send("no results")
		}
	} catch (err) {
		console.log(err.stack)
	}
})

app.post("/liked", async (req, res) => {
	try {
		const eersteMatch = await users.findOne({
			_id: new ObjectId(req.body.matchId),
		})

		const ik = await users.findOne({ username: "MysteryMan2" })
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

		if (
			ik.likes.includes(eersteMatch.username) &&
			ik.likedBy.includes(eersteMatch.username)
		) {
			console.log("match")
			res.redirect("/discover")
		} else {
			console.log("geen match")
			res.redirect("/discover")
		}
	} catch (err) {
		console.log(err.stack)
	}
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
