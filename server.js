require("dotenv").config()
const express = require("express")
const app = express()
const port = 8000
const path = require("path")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const bodyParser = require("body-parser")

// Set up bodyParser for drafts feature
app.use(bodyParser.urlencoded({ extended: false }))
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

// Database variables that are used in controllers
global.db = client.db(dbName)
global.users = db.collection("users")
global.letters = db.collection("letters")

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

// Redirect user to log in page if they are not logged in or registered
app.use((req, res, next) => {
	if (!req.session.user && req.url != "/account/login") {
		res.redirect("/account/login")
	} else {
		next()
	}
})

const homeRoutes = require("./routes/home.js")
app.use("/", homeRoutes)

const discoverRoutes = require("./routes/discover.js")
app.use("/", discoverRoutes)

const editorRoutes = require("./routes/editor.js")
app.use("/editor", editorRoutes)

const accountRoutes = require("./routes/account.js")
app.use("/account", accountRoutes)

app.listen(port, () => {
	console.log(`Wow! Look at that port ${port}`)
})
