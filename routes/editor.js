const express = require('express')
const router = express.Router()

const editorController = require('../controllers/editor.js')

router.get('/letter', editorController.letter)

router.get('/bottle', editorController.bottle)

router.post('/bottle', editorController.postBottle)

router.get('/drafts', editorController.drafts)

router.delete('/delete-draft', editorController.deleteDraft)

router.post('/drafts', editorController.postDraft)

module.exports = router
