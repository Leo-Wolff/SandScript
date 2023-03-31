async function CreateNewDraft(collection, content, input) {
	const draft = {
		text: content,
		signed: input,
		dateUpdated: new Date().toISOString().slice(0, 10), // oorspronkelijk date is handiger voor aanpassen later
	}

	await collection.insertOne(draft)
}

exports.letter = (req, res) => {
	res.render("pages/letter.ejs")
}

exports.bottle = (req, res) => {
	res.render("pages/bottle.ejs")
}

exports.bottle1 = (req, res) => {
	const collectionLetters = db.collection("letters")
	CreateNewDraft(collectionLetters, req.body.content, req.body.signed)
	res.render("pages/bottle.ejs")
}
