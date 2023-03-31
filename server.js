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

// async function CreateNewDraft(collection, content, input) {
// 	const draft = {
// 		text: content,
// 		signed: input,
// 		dateUpdated: new Date().toISOString().slice(0, 10), // oorspronkelijk date is handiger voor aanpassen later
// 	}

// 	await collection.insertOne(draft)
// }

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
// app.post("/uitloggen", (req, res) => {
// 	req.session.destroy()
// 	res.redirect("/inloggen")
// })
// app.get("/inloggen", (req, res) => {
// 	res.render("pages/inloggen")
// })
// app.post("/inloggen", async (req, res) => {
// 	const currentUser = await users.findOne({
// 		username: req.body.username,
// 	})
// 	req.session.user = {
// 		username: currentUser.username,
// 		password: currentUser.password,
// 		email: currentUser.email,
// 	}
// 	res.redirect("/account")
// })

//Profile page
// app.get("/account", async (req, res) => {
// 	const { username, email } = req.session.user
// 	res.render("pages/account", {
// 		username: username,
// 		email: email,
// 	})
// })

// app.post("/update", async (req, res) => {
// 	await users.findOneAndUpdate(
// 		{
// 			username: req.session.user.username,
// 		},
// 		{
// 			$set: {
// 				username: req.body.username,
// 				email: req.body.email,
// 			},
// 		}
// 	)
// 	req.session.user.username = req.body.username
// 	req.session.user.email = req.body.email
// 	res.redirect("/account")
// })

const homeRoutes = require("./routes/home.js")
app.use("/", homeRoutes)

const discoverRoutes = require("./routes/discover.js")
app.use("/", discoverRoutes)

const editorRoutes = require("./routes/editor.js")
app.use("/", editorRoutes)

const accountRoutes = require("./routes/account.js")
app.use("/", accountRoutes)

app.listen(port, () => {
	console.log(`Wow! Look at that ${port}`)
})
