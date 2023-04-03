const { ObjectId } = require("mongodb") // Defining ObjectId

// Load firstMatch on pageload
exports.discover = async (req, res) => {
	try {
		const filters = req.cookies.selectedFilters
			? JSON.parse(req.cookies.selectedFilters)
			: {} // Get filters that are stored in the cookies

			const currentUser = req.session.user // Current user thats logged im
			const firstMatch = await users.findOne({...filters, username: { $nin: [...currentUser.liked, ...currentUser.disliked], $not: {$eq: currentUser.username} } }) // find FirstMatch if username is not in liked or disliked of currentUser, Don't show currentUser as firstMatch.

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

		const currentUser = req.session.user
		const firstMatch = await users.findOne({...filters, username: { $nin: [...currentUser.liked, ...currentUser.disliked], $not: {$eq: currentUser.username} }})

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

		const currentUser = req.session.user
		currentUser.liked.push(firstMatch.username) // Update currentUser lokaal
		req.session.user = currentUser
		
		await users.updateOne(
			{ username: currentUser.username }, // Update firstMatched db
			{ $push: { liked: firstMatch.username } } // Add currentUser username to liked
		)

		await users.updateOne(
			{ username: firstMatch.username }, // Update firstMatched db
			{ $push: { likedBy: currentUser.username } } // Add currentUser username to likedBy
		)

		if (currentUser.liked.includes(firstMatch.username) && currentUser.likedBy.includes(firstMatch.username)) { // If firstMatch username is in the currentUser Liked and likedBy redirect to matched
			console.log('match')
			await users.updateOne(
				{ username: currentUser.username }, // Update firstMatched db
				{ $push: { matches: firstMatch.username } } // Add currentUser username to matches
			)
	
			await users.updateOne(
				{ username: firstMatch.username }, // Update firstMatched db
				{ $push: { matches: currentUser.username } } // Add currentUser username to matches
			)

			currentUser.matches.push(firstMatch.username)
			
			res.redirect('/discover')
		} else { // Else no match redirect to discover page
			console.log('geen match')
			res.redirect('/discover')
		}
	} catch (err) {
		console.log(err.stack)
	}
}

exports.disliked = async (req, res) => {
	try {
		const firstMatch = await users.findOne({
			_id: new ObjectId(req.body.matchId)
		})

		const currentUser = req.session.user
		currentUser.disliked.push(firstMatch.username) // Update currentUser lokaal
		req.session.user = currentUser

		await users.updateOne( 
			{ username: currentUser.username }, // Update currentUser
			{ $push: { disliked: firstMatch.username} } // Add firstMatch username to liked
		)

		res.redirect('/discover')

	} catch (err) {
		console.log(err.stack)
	}
}

// Matches page
exports.matchlist = async (req, res) => {
	try {
		const currentUser = req.session.user
		const userMatches = await users.find({ username: { $in: currentUser.matches }}).toArray()
		console.log(userMatches)

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
		const currentUser = req.session.user
		const userMatches = await users.find({ username: { $in: currentUser.matches }}).toArray()
		console.log(userMatches)

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

// const matches = await users.find({ username: { $in: currentUser.matches }})