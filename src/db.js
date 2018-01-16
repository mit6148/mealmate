const mongoose = require('mongoose');

//sets up mongoDB connection
const mongoURL = 'mongodb://liu:liuliuliu@ds257627.mlab.com:57627/liucubed'
const options = {
	useMongoClient: true,
};

mongoose.connect(mongoURL, options);
mongoose.Promise = global.Promise;
const db = mongoose.connection;

//error handling
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('connected', function(){ console.log('database connected'); });

module.exports = db;