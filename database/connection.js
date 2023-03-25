const mongoose = require('mongoose')


const connection = () => {
    try {
        mongoose.connect(process.env.URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Database connection is established!');
    } catch (err) {
        console.log('Error while connecting database: ', err);
        throw err;
    }

}

module.exports = connection;