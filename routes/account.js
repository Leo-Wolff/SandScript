const express = require("express")
const router = express.Router()

const accountController = require("../controllers/account.js")

// say what each pages is meant to do

router.post("/logout", accountController.logout)

router.get("/login", accountController.login)

router.post("/login", accountController.postLogin)

router.post("/update", accountController.update)

router.get("/edit", accountController.editProfile)

router.get("/profile", accountController.profile)

router.post("/profile", accountController.postRegister)

router.get("/register", accountController.register)

module.exports = router
