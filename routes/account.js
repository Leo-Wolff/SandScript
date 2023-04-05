const express = require("express")
const router = express.Router()

const accountController = require("../controllers/account.js")

router.post("/logout", accountController.logout) // Log out of account and get send to log in page

router.get("/login", accountController.login) // Get log in page

router.post("/login", accountController.postLogin) // Log into account and get send to home page

router.post("/update", accountController.update) // Post edit profile changes

router.get("/edit", accountController.editProfile) // Get account page to edit profile

router.get("/profile", accountController.profile) // Get profile page

router.post("/profile", accountController.postRegister) // Register a new account

router.get("/register", accountController.register) // Get register page

module.exports = router
