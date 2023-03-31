const express = require("express")
const router = express.Router()

const editorController = require("../controllers/editor.js")

router.get("/letter", editorController.letter)

router.get("/bottle", editorController.bottle)

module.exports = router
