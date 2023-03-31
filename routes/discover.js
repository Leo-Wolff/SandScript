const express = require("express")
const router = express.Router()

const discoverController = require("../controllers/discover.js")

router.get("/discover", discoverController.discover) // Get discover page

router.post("/discover", discoverController.discover1) // Post selectedfilter on discover page

router.post("/liked", discoverController.liked) // Like the FirstMatch

module.exports = router