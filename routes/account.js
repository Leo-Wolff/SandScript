const express = require("express")
const router = express.Router()

const accountController = require("../controllers/account.js")

router.post("/uitloggen", accountController.uitloggen)

router.get("/login", accountController.login)

router.post("/login", accountController.login1)

router.post("/update", accountController.update)

router.get("/account", accountController.account)

router.get("/profile", accountController.profile)

module.exports = router