const mongoose = require('mongoose');

const UserModelSchema = new mongoose.Schema ({
	name: String,
	fbid: String,
	about: String,
	course: String,
	year: String,
	about: String,
	halls: { type: Array, required: true, default: [] },
	residence: String,
	matches: { type : Array, required: true, default: [] }, // an array of other users' ids
});

module.exports = mongoose.model('UserModel', UserModelSchema);