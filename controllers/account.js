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
	if(currentUser) { 
	req.session.user = {
		username: currentUser.username,
		password: currentUser.password,
		email: currentUser.email,
		name: currentUser.name,
		age: currentUser.age,
		gender: currentUser.gender,
		interests: currentUser.interests,
		language: currentUser.language,
	}
	res.redirect("/account")
}
else {
	console.log("Account not found")
	res.redirect("/inloggen")
}
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
				password: req.body.password,
				name: req.body.name,
				age: req.body.age,
				gender: req.body.gender,
				interests: req.body.interests,
				country: req.body.country,
				language: req.body.language,
			},
		}
	)
	req.session.user.username = req.body.username
	req.session.user.email = req.body.email
	req.session.user.password = req.body.password
	req.session.user.name = req.body.name
	req.session.user.age = req.body.age
	req.session.user.interests = req.body.interests
	req.session.user.country = req.body.country
	req.session.user.language = req.body.language
	req.session.user.gender = req.body.gender
	res.redirect("/account")
}

// Profile page
exports.account = async (req, res) => {
	const { username, email, password, name, age, gender, interests, country, language } = req.session.user
	res.render("pages/account", {
		username: username,
		email: email,
		password: password,
		name: name,
		age: age,
		gender: gender,
		interests: interests,
		country: country,
		language: language
	})
}