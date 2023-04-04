const express = require("express")
const router = express.Router()

const editorController = require("../controllers/editor.js")

router.get("/test", editorController.test)

router.get("/drafts", editorController.drafts)

router.delete("/delete-draft", editorController.deleteDraft)

router.post("/drafts", editorController.postDraft)

router.get("/letter", editorController.letter)

router.get("/bottle", editorController.bottle)

router.post("/bottle", editorController.postBottle)

module.exports = router
