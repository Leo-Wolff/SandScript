const { ObjectId } = require('mongodb') // Defining ObjectId
const dbController = require('./editor-functions.js')

// TEXT EDITOR RELATED PAGES
exports.letter = async (req, res) => {
    if (req.query.draftID != null) {
        // If a draft item was clicked find the data for it

        let draftID = new ObjectId(req.query.draftID)
        let draftContent = await letters.findOne({ _id: draftID })
        let recipientProfile = await dbController.userFromUsers(
            'users',
            draftContent.recipient
        )

        console.log('Showing document:', req.query.documentId)

        res.render('pages/letter.ejs', {
            letters: draftContent,
            recipient: recipientProfile,
        })
    } else {
        // If no draft item was clicked, don't fetch any particular document (and thus, no data to show)
        const matchID = req.query.matchID
        const matchUser = decodeURIComponent(matchID).trim()

        req.session.matchUser = matchUser

        console.log(matchUser)

        let recipientProfile = await dbController.userFromUsers(
            'users',
            matchUser
        )

        let noData = await dbController.dataFromDatabase('letters')

        res.render('pages/letter.ejs', {
            letters: noData,
            recipient: recipientProfile,
        })
    }
}

// BOTTLE RELATED PAGES
exports.bottle = (req, res) => {
    res.render('pages/bottle.ejs')
}

exports.postBottle = async (req, res) => {
    if (ObjectId.isValid(req.body.id)) {
        // If a draft item was clicked update the data

        console.log('Updated document ID:', req.body.id)
        await dbController.updateDraft(
            letters,
            req.body.id,
            req.body.content,
            req.body.signed,
            true
        )

        res.redirect('/editor/bottle')
    } else {
        // If no draft item was clicked create a new draft
        const currentUser = req.session.user.username

        const matchUser = req.session.matchUser
        console.log(matchUser)

        let user = await dbController.userFromUsers('users', currentUser)

        console.log(user.username)

        console.log('No document ID specified.')
        await dbController.createDraft(
            letters,
            user.username,
            matchUser,
            req.body.content,
            req.body.signed
        )

        res.redirect('/editor/bottle')
    }
}

// DRAFTS RELATED PAGES
exports.drafts = async (req, res) => {
    const currentUser = req.session.user.username

    try {
        let user = await dbController.userFromUsers('users', currentUser)
        let draft = await dbController.draftsFromLetters(
            'letters',
            user.username
        )

        res.render('pages/drafts.ejs', {
            letters: draft,
        })
    } catch (err) {
        console.error(err)
        res.status(500).send('Internal Server Error')
    }
}

exports.deleteDraft = async (req, res) => {
    const result = await letters.deleteOne({
        _id: new ObjectId(req.body.draftID),
    })

    res.json({ message: `${result.deletedCount} document(s) deleted` })
}

exports.postDraft = async (req, res) => {
    if (ObjectId.isValid(req.body.id)) {
        // If a draft item was clicked update the data

        console.log('Updated document ID:', req.body.id)
        await dbController.updateDraft(
            letters,
            req.body.id,
            req.body.content,
            req.body.signed,
            false
        )

        res.redirect('/editor/drafts')
    } else {
        // If no draft item was clicked create a new draft
        const currentUser = req.session.user.username

        const matchUser = req.session.matchUser
        console.log(matchUser)

        let user = await dbController.userFromUsers('users', currentUser)

        console.log(user.username)

        console.log('No document ID specified.')
        await dbController.createDraft(
            letters,
            user.username,
            matchUser,
            req.body.content,
            req.body.signed
        )

        res.redirect('/editor/drafts')
    }
}
