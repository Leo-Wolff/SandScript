const express = require("express")
const router = express.Router()

const accountController = require("../controllers/account.js")

router.post("/logout", accountController.logout)

router.get("/login", accountController.login)

router.post("/login", accountController.login1)

router.post("/update", accountController.update)

router.get("/account", accountController.account)

router.get("/profile", accountController.profile)

router.post("/profile", accountController.postRegister)

router.get("/register", accountController.register)

module.exports = router
