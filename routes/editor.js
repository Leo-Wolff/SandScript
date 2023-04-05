const express = require("express")
const router = express.Router()

const editorController = require("../controllers/editor.js")

router.get("/letter", editorController.letter) // Get letter page aka text editor

router.get("/bottle", editorController.bottle) // Get bottle page

router.post("/bottle", editorController.postBottle) // Post letter information and get bottle page

router.get("/drafts", editorController.drafts) // Get drafts page

router.delete("/delete-draft", editorController.deleteDraft) // Delete draft document and reload drafts page

router.post("/drafts", editorController.postDraft) // Post letter information and get drafts page

module.exports = router
