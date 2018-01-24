const mongoose = require('mongoose');

const UserModelSchema = new mongoose.Schema ({
	name: String,
	fbid: String,
	email: String,
	piclink: String,
	course: String,
	year: String,
	about: String,
	residence: String,
	matches: Array,
	hkc: Array, // array of homestate, kerberos, cell phone
	favorites: Array, // array of all the favorite things
	interests: String
});

module.exports = mongoose.model('UserModel', UserModelSchema);