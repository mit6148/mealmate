const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserModelSchema = new mongoose.Schema ({
	name: String,
	fbid: String,
	email: String,
	piclink: String,
	course: String,
	year: String,
	about: String,
	residence: String,
	matches: [{
		userid: {type: Schema.Types.ObjectId, ref: 'UserModel'},
		date: String, 
		times: Array, 
		halls: Array,
		confirmed: Boolean
	}],
	hkc: Array, // array of homestate, kerberos, cell phone
	favorites: Array, // array of all the favorite things
	interests: String
});

module.exports = mongoose.model('UserModel', UserModelSchema);