const mongoose = require('mongoose');

const UserModelSchema = new mongoose.Schema ({
	name: String,
	fbid: String,
	about: String,
	course: String,
	year: String,
	about: String,
	residence: String,

});

module.exports = mongoose.model('UserModel', UserModelSchema);