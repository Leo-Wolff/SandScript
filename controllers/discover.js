const { ObjectId } = require("mongodb") // Defining ObjectId

// Load firstMatch on pageload
exports.discover = async (req, res) => {
	try {
		const filters = req.cookies.selectedFilters
			? JSON.parse(req.cookies.selectedFilters)
			: {} // Get filters that are stored in the cookies

			const ik = await users.findOne({username: 'MysteryMan'}) // Faked CurrentUser
			const firstMatch = await users.findOne({...filters, username: { $nin: ik.liked, $not: {$eq: ik.username} }, status: 'new'}) // find FirstMatch if username is not in liked or disliked of currentUser, Don't show currentUser as firstMatch.

		res.render('pages/gefiltered', { firstMatch }) // Render the page with the first match
	} catch (err) {
		console.log(err.stack)
	}
}

// If filtered show firstMatch
exports.discover1 = async (req, res) => {
	try {
		const filters = { gender: req.body.gender } // Save input from user in filters

		res.cookie("selectedFilters", JSON.stringify(filters)) // Save selected filters in cookie

		const ik = await users.findOne({username: 'MysteryMan'})
		const firstMatch = await users.findOne({...filters, username: { $nin: ik.liked, $not: {$eq: ik.username} }, status: 'new'})

		if (firstMatch) {
			res.render("pages/gefiltered", { firstMatch })
		} else { // If no results show this
			res.send("no results")
		}
	} catch (err) {
		console.log(err.stack)
	}
}


exports.liked = async (req, res) => {
	try {
		const firstMatch = await users.findOne({
			_id: new ObjectId(req.body.matchId)
		})

		const ik = await users.findOne({username: 'MysteryMan'})

		await users.updateOne( 
			{ _id: ik._id }, // Update currentUser
			{ $push: { liked: firstMatch.username} } // Add firstMatch username to liked
		)

		await users.updateOne(
			{ _id: firstMatch._id }, // Update firstMatched
			{ $push: { likedBy: ik.username } } // Add currentUser username to likedBy
		)

		ik.liked.push(firstMatch.username)
		firstMatch.likedBy.push(ik.username)

		if (ik.liked.includes(firstMatch.username) && ik.likedBy.includes(firstMatch.username)) { // If firstMatch username is in the currentUser Liked and likedBy redirect to matched
			console.log('match')
			res.redirect('/discover')
		} else { // Else no match redirect to discover page
			console.log('geen match')
			res.redirect('/discover')
		}
	} catch (err) {
		console.log(err.stack)
	}
}

// Matches page
exports.matchlist = async (req, res) => {
	try {
		const filters = req.cookies.selectedFilters
			? JSON.parse(req.cookies.selectedFilters)
			: {} // get filters from cookie 

		const eersteMatch = await users.find({ }).toArray() // filter between the selcted filters and status new

		res.render('pages/matches', { eersteMatch }) // Render the page with the first match
	} catch (err) {
		console.log(err.stack)
	}
}

// sorting in matches page
exports.matchlist1 = async (req, res) => {
	try {
		const sortBy = req.body.sorteren;
		let sortOption = {}
	
		if (sortBy === 'age') {
		  sortOption = { age: 1 }
		} else if (sortBy === 'name') {
			sortOption = { name: 1 }
		} else if (sortBy === '-name') {
			sortOption = { name: -1 }
		}
	
		const eersteMatch = await users
		  .find({})
		  .sort(sortOption)
		  .toArray() // Retrieve all the documents in the collection, sorted by the user's selection

		if (eersteMatch.length > 0) {
			res.render('pages/matches', { eersteMatch })
		} else {
			res.send('no results')
		}
	} catch (err) {
		console.log(err.stack)
	}
}