const mongoose = require("mongoose")

const connection = () => {
	try {
		mongoose.connect(process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		console.log("Database connection is established!")
	} catch (err) {
		console.log("Error while connecting database: ", err)
		throw err
	}
}

module.exports = connection
