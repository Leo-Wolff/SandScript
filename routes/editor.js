const express = require("express")
const router = express.Router()

const editorController = require("../controllers/editor.js")

router.get("/letter", editorController.letter)

router.get("/bottle", editorController.bottle)

router.post("/bottle", editorController.bottle1)

module.exports = router
