const mongoose = require('mongoose');

const MatchRequestModelSchema = new mongoose.Schema({
	userid: String,
	date: String,
	halls: Array,
	times: Array,
});

module.exports = mongoose.model('MatchRequestModel', MatchRequestModelSchema);