exports.index = (req, res) => {
	res.render("pages/index.ejs")
}

exports.matches = async (req, res) => {
	let draft = await getDataFromDatabase("letters")
	res.render("pages/matches.ejs", {
		letters: draft,
	})
}

// console.log(db)
function getDataFromDatabase(dbCollection) {
	// const db = client.db(dbName)
	let collection = db.collection(dbCollection) // collectie naam
	collection = GetDraftsFromDatabase(collection)

	return collection
}

async function GetDraftsFromDatabase(collection) {
	return collection.find().toArray()
}

exports.profile = async (req, res) => {
	const { username, email } = req.session.user
	res.render("pages/account.ejs", {
		username: username,
		email: email,
	})
}
