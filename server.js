require("dotenv").config()
const express = require("express")
const app = express()
const port = 8000
const path = require("path")
const bodyParser = require("body-parser")

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Connecting mongoDB
const { MongoClient, ServerApiVersion } = require("mongodb")
const uri = process.env.MONGODB_URI
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
})
const dbName = "sandscript"

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

app.get("/", async (req, res) => {
	res.render("pages/index")
})

app.get("/matches", async (req, res) => {
	let draft = await getDataFromDatabase("letters")
	res.render("pages/matches", {
		letters: draft,
	})
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

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
