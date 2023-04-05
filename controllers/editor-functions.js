const { ObjectId } = require('mongodb') // Defining ObjectId

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

module.exports = {
    createDraft,
    updateDraft,
    dataFromDatabase,
    userFromDatabase,
    draftsFromDatabase,
}
