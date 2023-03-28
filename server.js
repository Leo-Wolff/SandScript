require("dotenv").config()
const express = require("express")
const app = express()
const port = 8000
const path = require("path")

// Connecting mongoDB
const { MongoClient, ServerApiVersion } = require("mongodb")
const uri = process.env.MONGODB_URI
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
})
// const dbName = "sandscript"
client.connect()

// set the view engine to ejs
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "/static")))

app.get("/", async (req, res) => {
	res.render("pages/index")
})

app.get("/matches", (req, res) => {
	res.render("pages/matches")
})

app.get("/letter", (req, res) => {
	res.render("pages/letter")
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
