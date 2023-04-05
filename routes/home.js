const express = require('express')
const router = express.Router()

const homeController = require('../controllers/home.js')

router.get('/', homeController.index)

module.exports = router
