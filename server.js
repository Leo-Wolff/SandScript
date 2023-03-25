const express = require('express')
const app = express()
const port = 8000
const connection = require("./database/connection")
require('dotenv').config()

// Database connection
connection()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})