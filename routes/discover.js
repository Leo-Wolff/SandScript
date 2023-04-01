const express = require("express")
const router = express.Router()

const discoverController = require("../controllers/discover.js")

router.get("/discover", discoverController.discover) // Get discover page

router.post("/discover", discoverController.discover1) // Post selectedfilter on discover page

router.post("/liked", discoverController.liked) // Like the FirstMatch

router.post("/disliked", discoverController.disliked) // Like the FirstMatch

router.get("/matches", discoverController.matchlist) // Match list of all your matches

router.post("/matches", discoverController.matchlist1)

module.exports = router