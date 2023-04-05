const { ObjectId } = require("mongodb") // Defining ObjectId
const userCollection = "users"
const letterCollection = "letters"
const collectionLetters = db.collection(letterCollection) // Connect to letters collection

async function createDraft(
	collection,
	currentUser,
	matchUsername,
	content,
	input
) {
	const create = {
		author: currentUser,
		recipient: matchUsername,
		text: content,
		signed: input,
		dateUpdated: new Date(),
	}

	await collection.insertOne(create)
}

async function deleteDraft(req, res) {
	const result = await collectionLetters.deleteOne({
		_id: new ObjectId(req.body.draftID),
	})

	res.json({ message: `${result.deletedCount} document(s) deleted` })
}

async function updateDraft(
	collection,
	draftID,
	content,
	input,
	shouldUpdateSigned
) {
	const filter = { _id: new ObjectId(draftID) }
	const update = {
		$set: {
			text: content,
			dateUpdated: new Date(),
		},
	}

	// when updating a draft through postDraft, you can't specify signed, so true/false statement to not update the signature
	if (shouldUpdateSigned) {
		update.$set.signed = input
	}

	const result = await collection.updateOne(filter, update)
	// console.log("Updated document count:", result.modifiedCount)

	return result
}

function dataFromDatabase(dbCollection) {
	let collection = db.collection(dbCollection) // collection name
	collection = getDataFromDatabase(collection)

	return collection
}

async function getDataFromDatabase(collection) {
	return collection.find().toArray()
}

async function userFromDatabase(dbCollection, currentUser) {
	let collection = db.collection(dbCollection)
	let user = await getUserFromDatabase(collection, currentUser)

	return user
}

async function getUserFromDatabase(collection, currentUser) {
	return collection.findOne({ username: currentUser })
}

async function draftsFromDatabase(dbCollection, currentUser) {
	let collection = db.collection(dbCollection)
	let user = await getDraftsFromDatabase(collection, currentUser)

	return user
}

async function getDraftsFromDatabase(collection, currentUser) {
	return collection.find({ author: currentUser }).toArray()
}

exports.letter = async (req, res) => {
	if (req.query.documentId != null) {
		// If a draft item was clicked find the data for it

		let draftID = new ObjectId(req.query.documentId)
		let draftContent = await collectionLetters.findOne({ _id: draftID })
		let recipientProfile = await userFromDatabase(
			"users",
			draftContent.recipient
		)

		console.log("Showing document:", req.query.documentId)

		res.render("pages/letter.ejs", {
			letters: draftContent,
			recipient: recipientProfile,
		})
	} else {
		// If no draft item was clicked, don't fetch any particular document (and thus, no data to show)
		const matchId = req.query.MatchId
		const matchUser = decodeURIComponent(matchId).trim()

		req.session.matchUser = matchUser

		console.log(matchUser)

		let recipientProfile = await userFromDatabase("users", matchUser)

		let noData = await dataFromDatabase("letters")

		res.render("pages/letter.ejs", {
			letters: noData,
			recipient: recipientProfile,
		})
	}
}

exports.bottle = (req, res) => {
	res.render("pages/bottle.ejs")
}

exports.postBottle = async (req, res) => {
	if (ObjectId.isValid(req.body.id)) {
		// If a draft item was clicked update the data

		console.log("Updated document ID:", req.body.id)
		await updateDraft(
			collectionLetters,
			req.body.id,
			req.body.content,
			req.body.signed,
			true
		)

		res.redirect("/editor/bottle")
	} else {
		// If no draft item was clicked create a new draft
		const currentUser = req.session.user.username

		const matchUser = req.session.matchUser
		console.log(matchUser)

		let user = await userFromDatabase(userCollection, currentUser)

		console.log(user.username)

		console.log("No document ID specified.")
		await createDraft(
			collectionLetters,
			user.username,
			matchUser,
			req.body.content,
			req.body.signed
		)

		res.redirect("/editor/bottle")
	}
}

exports.drafts = async (req, res) => {
	const currentUser = req.session.user.username

	try {
		let user = await userFromDatabase(userCollection, currentUser)
		let draft = await draftsFromDatabase(letterCollection, user.username)

		res.render("pages/drafts.ejs", {
			letters: draft,
		})
	} catch (err) {
		console.error(err)
		res.status(500).send("Internal Server Error")
	}
}

exports.deleteDraft = async (req, res) => {
	await deleteDraft(req, res)
}

exports.postDraft = async (req, res) => {
	if (ObjectId.isValid(req.body.id)) {
		// If a draft item was clicked update the data

		console.log("Updated document ID:", req.body.id)
		await updateDraft(
			collectionLetters,
			req.body.id,
			req.body.content,
			req.body.signed,
			false
		)

		res.redirect("/editor/drafts")
	} else {
		// If no draft item was clicked create a new draft
		const currentUser = req.session.user.username

		const matchUser = req.session.matchUser
		console.log(matchUser)

		let user = await userFromDatabase(userCollection, currentUser)

		console.log(user.username)

		console.log("No document ID specified.")
		await createDraft(
			collectionLetters,
			user.username,
			matchUser,
			req.body.content,
			req.body.signed
		)

		res.redirect("/editor/drafts")
	}
}
