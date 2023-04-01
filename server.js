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
global.db = client.db(dbName)
global.users = db.collection("users")

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
	res.render("pages/inloggen")
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
// app.get("/account", async (req, res) => {
// 	const { username, email } = req.session.user
// 	res.render("pages/account", {
// 		username: username,
// 		email: email,
// 	})
// })

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

const editorRoutes = require("./routes/editor.js")
app.use("/editor", editorRoutes)

const homeRoutes = require("./routes/home.js")
app.use("/home", homeRoutes)

app.post("/editor/bottle", (req, res) => {
	const db = client.db(dbName)
	const collectionLetters = db.collection("letters")
	CreateNewDraft(collectionLetters, req.body.content, req.body.signed)
	res.render("pages/bottle")
})

app.delete("/delete-draft", async (req, res) => {
	try {
		await connectToDatabase()
		const collectionLetters = db.collection("letters")
		const result = await collectionLetters.deleteOne({
			_id: ObjectID(req.body.documentId),
		})
		res.json({ message: `${result.deletedCount} document(s) deleted` })
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: err.message })
	}
})

// discover page
// app.get('/discover', async (req, res) => {
// 	try {
// 		const filters = req.cookies.selectedFilters
// 			? JSON.parse(req.cookies.selectedFilters)
// 			: {} // get filters from cookie

// 			const ik = await users.findOne({username: 'MysteryMan'})
// 			const eersteMatch = await users.findOne({...filters, username: { $nin: ik.likes, $not: {$eq: ik.username} }, status: 'new'})

// 		res.render('pages/gefiltered', { eersteMatch }) // Render the page with the first match
// 	} catch (err) {
// 		console.log(err.stack)
// 	}
// })

// discover page
// app.get("/discover", async (req, res) => {
// 	try {
// 		const filters = req.cookies.selectedFilters
// 			? JSON.parse(req.cookies.selectedFilters)
// 			: {} // get filters from cookie

// 		const ik = await users.findOne({ username: "MysteryMan2" })
// 		const eersteMatch = await users.findOne({
// 			...filters,
// 			username: { $nin: ik.likes, $not: { $eq: ik.username } },
// 			status: "new",
// 		})

// 		res.render("pages/gefiltered", { eersteMatch }) // Render the page with the first match
// 	} catch (err) {
// 		console.log(err.stack)
// 	}
// })

// filtering in discover page
app.post("home/discover", async (req, res) => {
	try {
		const filters = { gender: req.body.gender } // save input from user in filters

		res.cookie("selectedFilters", JSON.stringify(filters)) // save filters in cookie

		console.log(req.session)

		const ik = await users.findOne({ username: "MysteryMan" })
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

		const ik = await users.findOne({ username: "MysteryMan" })
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
			res.redirect("home/discover")
		} else {
			console.log("geen match")
			res.redirect("home/discover")
		}
	} catch (err) {
		console.log(err.stack)
	}
})

app.listen(port, () => {
	console.log(`Wow! Look at that ${port}`)
})
