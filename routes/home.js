const express = require("express")
const router = express.Router()

const homeController = require("../controllers/home.js")

router.get("/", homeController.index)

// router.get("/matches", homeController.drafts)

// router.get("/profile", homeController.profile)

module.exports = router