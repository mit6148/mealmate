const mongoose = require('mongoose');

//sets up mongoDB connection
const mongoURL = process.env.MLAB_URL;
const options = {
	useMongoClient: true,
};

mongoose.connect(mongoURL, options);
mongoose.Promise = global.Promise;
const db = mongoose.connection;

//error handling
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('connected', function(){ console.log('database connected'); });

/* const today = new Date();
    MatchRequest.find({}, function(err, matches) { // get all matches
        // connect to the database
        mongoose.connect(mongoURL, options, function(err, db) {
            if (err) throw err;
            for (let i=0; i<matches.length; i++) {
                if (matches[i].date < today) { // if the day of the match has passed
                    db.collection("matchrequestmodels").deleteOne({'_id': matches[i]._id})
                }
            }
        });
    })
*/

module.exports = db;