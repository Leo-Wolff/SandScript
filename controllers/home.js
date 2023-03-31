exports.index = (req, res) => {
	res.render("pages/index.ejs")
}

exports.discover = async (req, res) => {
	try {
		const filters = req.cookies.selectedFilters
			? JSON.parse(req.cookies.selectedFilters)
			: {} // get filters from cookie 

			const ik = await users.findOne({username: 'MysteryMan'})
			const eersteMatch = await users.findOne({...filters, username: { $nin: ik.likes, $not: {$eq: ik.username} }, status: 'new'})

		res.render('pages/gefiltered', { eersteMatch }) // Render the page with the first match
	} catch (err) {
		console.log(err.stack)
	}
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
