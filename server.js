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
app.use((req, res, next) => {
	if (!req.session.user && req.url != "/login") {
		res.redirect("/login"); 
	} 
	else { 
		next(); 
	} 
});

const homeRoutes = require("./routes/home.js")
app.use("/", homeRoutes)

const discoverRoutes = require("./routes/discover.js")
app.use("/", discoverRoutes)

const editorRoutes = require("./routes/editor.js")
app.use("/", editorRoutes)

const accountRoutes = require("./routes/account.js")
app.use("/", accountRoutes)

// Register
// app.get("/register", (req, res) => {
// 	res.render("pages/register.ejs")
// })

// app.post("/account", async (req, res) => {
// 	const username = req.body.username
// 	const email = req.body.email
// 	const password = req.body.password
// 	const hashedPassword = await bcrypt.hash(password, 10)
// 	const user = {
// 		username,
// 		email,
// 		password: hashedPassword,
// 	}
// 	users.insertOne(user)
// 	res.render("pages/account.ejs")
// })

app.listen(port, () => {
	console.log(`Wow! Look at that port ${port}`)
})
