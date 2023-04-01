exports.uitloggen = (req, res) => {
	req.session.destroy()
	res.redirect("/inloggen")
}

exports.inloggen = (req, res) => {
	res.render("pages/inloggen")
}

exports.inloggen1 = async (req, res) => {
	const currentUser = await users.findOne({
		username: req.body.username,
	})
	req.session.user = {
		username: currentUser.username,
		password: currentUser.password,
		email: currentUser.email,
	}
	res.redirect("/account")
}

exports.update = async (req, res) => {
	await users.findOneAndUpdate(
		{
			username: req.session.user.username,
		},
		{
			$set: {
				username: req.body.username,
				email: req.body.email,
			},
		}
	)
	req.session.user.username = req.body.username
	req.session.user.email = req.body.email
	res.redirect("/account")
}

// Profile page
exports.account = async (req, res) => {
	const { username, email } = req.session.user
	res.render("pages/account", {
		username: username,
		email: email,
	})
}

// Register page
exports.register = (req, res) => {
	res.render("pages/register.ejs")
}

const bcrypt = require("bcrypt")

exports.postRegister = async (req, res) => {
	const username = req.body.username
	const email = req.body.email
	const password = req.body.password
	const hashedPassword = await bcrypt.hash(password, 10)
	const user = {
		username,
		email,
		password: hashedPassword,
	}
	users.insertOne(user)
	res.render("pages/account.ejs")
}
