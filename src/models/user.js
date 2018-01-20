const mongoose = require('mongoose');

const UserModelSchema = new mongoose.Schema ({
	name: String,
	fbid: String,
	email: String,
	about: String,
	course: String,
	year: String,
	about: String,
	halls: Array,
	residence: String,
	matches: Array,
});

module.exports = mongoose.model('UserModel', UserModelSchema);