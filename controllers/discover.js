const { ObjectId } = require('mongodb') // Defining ObjectId

// Load firstMatch on pageload
exports.discover = async (req, res) => {
	try {
		const filters = req.cookies.selectedFilters
			? JSON.parse(req.cookies.selectedFilters)
			: {} // Get filters that are stored in the cookies

		const currentUser = req.session.user // Current user thats logged im
		const firstMatch = await users.findOne({
			...filters,
			username: {
				$nin: [...currentUser.liked, ...currentUser.disliked],
				$not: { $eq: currentUser.username }
			}
		}) // find FirstMatch if username is not in liked or disliked of currentUser, Don't show currentUser as firstMatch.

		res.render('pages/gefiltered', { firstMatch }) // Render the page with the first match
	} catch (err) {
		console.log(err.stack)
	}
}

// If filtered show firstMatch
exports.discover1 = async (req, res) => {
	try {
		// chazz helped me with this
		// Create an empty object 
		let filters = {} 
		// Get all the keys from the req.body 
		const keys = Object.keys(req.body) 
		// Loop through the keys 
		keys.forEach((key) => { // If the key is not empty 
			if (req.body[key]) { // Check if the key is minAge or maxAge 
				if (key === "minAge" || key === "maxAge") {
					 filters.age = { $gte: parseInt(req.body.minAge), $lte: parseInt(req.body.maxAge), } 
					} else if (key === "gender") { 
						filters.gender = req.body.gender 
					} else if (key === "language" && req.body.language !== "choose") { 
						filters.language = req.body.language 
					} else if (key === "country" && req.body.country !== "choose") { 
						filters.country = req.body.country 
					} else if (key === "interests" && req.body.interests !== "choose") {
						filters.interests = req.body.interests 
					} 
				} 
			})

		console.log(filters)

		res.cookie('selectedFilters', JSON.stringify(filters)) // Save selected filters in cookie

		const currentUser = req.session.user
		const firstMatch = await users.findOne({
			...filters,
			username: {
				$nin: [...currentUser.liked, ...currentUser.disliked],
				$not: { $eq: currentUser.username }
			}
		})

		res.render('pages/gefiltered', { firstMatch })

	} catch (err) {
		console.log(err.stack)
	}
}

exports.match = async (req, res) => {
	try {
		const currentUser = req.session.user
		const userMatch = await users.findOne({ username: { $in: currentUser.matches.slice(-1) }} )

		res.render("pages/match.ejs", { userMatch }) // Match pagina met als route /match
	} catch (error) {
		console.error(error);
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
			
			res.redirect('/match')
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
			{ $push: { disliked: firstMatch.username } } // Add firstMatch username to liked
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


		const userMatches = await users
			.find({ username: { $in: currentUser.matches } })
			.toArray()

		console.log(userMatches)
    
		res.render('pages/matches', { userMatches }) // Render the page with the matches
	} catch (err) {
		console.log(err.stack)
	}
}

// sorting in matches page
exports.matchlist1 = async (req, res) => {
	try {
		const currentUser = req.session.user

		const sortBy = req.body.sorteren

		let sortOption = {}

		if (sortBy === 'age') {
			sortOption = { age: 1 }
		} else if (sortBy === 'name') {
			sortOption = { name: 1 }
		} else if (sortBy === '-name') {
			sortOption = { name: -1 }
		}

		const userMatches = await users
			.find({ username: { $in: currentUser.matches } })
			.sort(sortOption)
			.toArray() // Retrieve all the matches, sorted by the user's selection

		if (userMatches.length > 0) {
			res.render('pages/matches', { userMatches })
		} else {
			res.send('no results')
		}
	} catch (err) {
		console.log(err.stack)
	}
}
