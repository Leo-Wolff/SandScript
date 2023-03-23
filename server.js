const express = require("express")
const app = express()
const port = 8000

app.set("view engine", "ejs")

app.get("/", (req, res) => {
	res.send("Hello World!")
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
