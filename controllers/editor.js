const { ObjectId } = require("mongodb") // Defining ObjectId

async function CreateNewDraft(collection, content, input) {
	const draft = {
		text: content,
		signed: input,
		dateUpdated: new Date(),
	}

	await collection.insertOne(draft)
}

function getDataFromDatabase(dbCollection) {
	let collection = db.collection(dbCollection) // collection name
	collection = GetDraftsFromDatabase(collection)

	return collection
}

async function GetDraftsFromDatabase(collection) {
	return collection.find().toArray()
}

exports.drafts = async (req, res) => {
	let draft = await getDataFromDatabase("letters")
	res.render("pages/drafts.ejs", {
		letters: draft,
	})
}

exports.postDraft = async (req, res) => {
	const collectionLetters = db.collection("letters")
	await CreateNewDraft(collectionLetters, req.body.content, req.body.signed)

	res.redirect("/drafts")
}

exports.deleteDraft = async (req, res) => {
	const collectionLetters = db.collection("letters")
	try {
		const result = await collectionLetters.deleteOne({
			_id: new ObjectId(req.body.draftId),
		})
		res.json({ message: `${result.deletedCount} document(s) deleted` })
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: err.message })
	}
}

// exports.letter = async (req, res) => {
// 	res.render("pages/letter.ejs")
// }

exports.letter = async (req, res) => {
	if (req.query.documentId != null) {
		try {
			let draft = await db.collection("letters").findOne({
				_id: new ObjectId(req.query.documentId),
			})

			console.log(draft)

			res.render("pages/letter.ejs", {
				letters: draft,
			})
		} catch (err) {
			console.error(err)
		}
	} else {
		let draft = await getDataFromDatabase("letters")
		res.render("pages/letter.ejs", {
			letters: draft,
		})
	}
}

exports.bottle = (req, res) => {
	res.render("pages/bottle.ejs")
}

exports.bottle1 = (req, res) => {
	const collectionLetters = db.collection("letters")
	CreateNewDraft(collectionLetters, req.body.content, req.body.signed)
	res.render("pages/bottle.ejs")
}
