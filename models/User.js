const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new Schema({
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	age: {
		type: String,
		required: true,
	},
	gender: {
		type: String,
		required: true,
	},
	interests: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		required: true,
	},
	country: {
		type: String,
		required: true,
	},
})

const User = mongoose.model("User", UserSchema)
module.exports = User
