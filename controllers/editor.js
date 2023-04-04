const { ObjectId } = require("mongodb") // Defining ObjectId
const collectionLetters = db.collection("letters") // Connect to letters collection

async function createDraft(collection, content, input) {
	// find collection data author and recipient

	const create = {
		text: content,
		signed: input,
		dateUpdated: new Date(),
	}

	await collection.insertOne(create)

	// insert info author and recipient
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

function getDataFromDatabase(dbCollection) {
	let collection = db.collection(dbCollection) // collection name
	collection = getDraftsFromDatabase(collection)

	return collection
}

async function getDraftsFromDatabase(collection) {
	return collection.find().toArray()

	// filter on author (in find)
}

exports.drafts = async (req, res) => {
	let draft = await getDataFromDatabase("letters")

	res.render("pages/drafts.ejs", {
		letters: draft,
	})
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

		res.redirect("/drafts")
	} else {
		// If no draft item was clicked create a new draft

		console.log("No document ID specified.")
		await createDraft(collectionLetters, req.body.content, req.body.signed)

		res.redirect("/drafts")
	}
}

exports.letter = async (req, res) => {
	if (req.query.documentId != null) {
		// If a draft item was clicked find the data for it

		const draftID = new ObjectId(req.query.documentId)
		const draft = await collectionLetters.findOne({ _id: draftID })

		console.log("Showing document:", req.query.documentId)

		res.render("pages/letter.ejs", {
			letters: draft,
		})
	} else {
		// If no draft item was clicked, don't fetch any particular document (and thus, no data to show)

		let draft = await getDataFromDatabase("letters")
		res.render("pages/letter.ejs", {
			letters: draft,
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

		res.redirect("/bottle")
	} else {
		// If no draft item was clicked create a new draft

		console.log("No document ID specified.")
		await createDraft(collectionLetters, req.body.content, req.body.signed)

		res.redirect("/bottle")
	}
}
