const express = require("express")
const router = express.Router()

const editorController = require("../controllers/editor.js")

router.get("/drafts", editorController.drafts)

router.get("/letter", editorController.letter)

router.get("/bottle", editorController.bottle)

router.post("/bottle", editorController.bottle1)

router.delete("/delete-draft", editorController.deleteDraft)

module.exports = router
