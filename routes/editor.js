const express = require("express")
const router = express.Router()

const editorController = require("../controllers/editor.js")

router.get("/drafts", editorController.drafts)

router.post("/drafts", editorController.postDraft)

router.delete("/delete-draft", editorController.deleteDraft)

router.get("/letter", editorController.letter)

router.get("/bottle", editorController.bottle)

router.post("/bottle", editorController.postBottle)

module.exports = router
