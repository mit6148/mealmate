const hallAvailabilities = [
    [8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5],
    [true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, false], //Baker availability
    [true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, true, true, true, true, true, true, true, true], //Maseeh availability
    [true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, false, false], //McCormick availability
    [true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, false], //Next availability
    [true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, false, false] //Simmons availability
];

// dependencies
const express = require('express');
const connect = require('connect-ensure-login');
const mongoose = require('mongoose');

// models
const User = require('../models/user');
const MatchRequest = require('../models/matchRequest');

const router = express.Router();

const addPhoto = require('../pictures').addPhoto;
const sendEmail = require('../emailSender').sendEmail;

// set up mongoDB connection
const mongoURL = process.env.MLAB_URL;
const options = {
    useMongoClient: true,
};

// api endpoints
router.get('/whoami', function(req, res) {
    if (req.isAuthenticated()){
        res.send(req.user);
    } else {
        res.send({});
    }
});

router.get('/user', function(req, res) {
    User.findOne({ _id: req.query._id}, function(err, user){
        res.send(user);
    });
});

// match step 2: get matching requests
router.get('/matchRequest', function(req, res) {
    // first: the match must eat on the same day
    MatchRequest.find({ date: req.query.date }, function(err, matches) {
        if (err) { // log error
            console.log("Error " + err);
            res.send({message: "There was an error!"}); // error
        }
        // if there are matches, filter them
        if (matches && matches.length) {
            console.log("Here are matches " + matches);
            let idMatches = [];
            let timeMatches = [];

            // filter by user id
            for (let i=0; i<matches.length; i++) {
                if (req.query.userid != matches[i].userid) {
                    console.log("Hey, it isn't yourself!");
                    idMatches.push(matches[i]); // add that match
                }
            }

            // filter by times if there remain matches
            if (idMatches.length) {
                const uTimes = req.query.times.split(",");
                let timeMatches = []; let possibleTimes = [];
                for (let i=0; i<idMatches.length; i++) { // for each match
                    let hasBeenMatched = false;
                    let timesForMatch = new Set(); // times shared between user and match

                    for (let j=0; j<uTimes.length; j++) { // for each of user's times
                
                        if (idMatches[i].times.includes(uTimes[j])) {
                            if (!hasBeenMatched) {
                                timeMatches.push(idMatches[i]);
                                timesForMatch.add(uTimes[j]);
                                hasBeenMatched = true;
                            } else {
                                timesForMatch.add(uTimes[j]); // still a possible time
                            } // end if
                        } // end if
                    } // end for loop of your times

                    if (timesForMatch.size != 0) {
                        possibleTimes.push(timesForMatch); 
                    }
                } // end for loop over all your matches
                if (timeMatches.length) {
                    console.log("There's at least one match request that works!");
                    
                    // just take the first one
                    // extract first set of possible times, find a shared fav hall
                    const posTimes = Array.from(possibleTimes[0]);
                    const myHalls = req.query.halls.split(",");
                    const matchHalls = timeMatches[0].halls;
                    let meetHall = "";
                    const availabilityIdx = hallAvailabilities[0].indexOf(parseInt(posTimes[0]));
                    var hallFitsTime = 
                        [['Baker', 'Maseeh', 'McCormick', 'Next', 'Simmons'],
                        [false, false, false, false, false], //start with all of halls not fit time
                        [0, 0, 0, 0, 0]]; //start with all halls rank of 0
                    //find the halls open during the required time
                    for (let i = 1; i < hallAvailabilities.length; i++){
                        if (hallAvailabilities[i][availabilityIdx]){
                            hallFitsTime[1][i-1] = true;
                        }
                    }
                    //get sum of ranking for each hall from both users, lower total means more favorable hall
                    //use lowercase to compare since McCormick spelled differently in another page
                    const lowercaseHalls = hallFitsTime[0].map(e => e.toLowerCase());
                    for (let i=0; i<matchHalls.length; i++){
                        hallFitsTime[2][lowercaseHalls.indexOf(matchHalls[i].toLowerCase())] += i;
                    }
                    for (let i=0; i<myHalls.length; i++){
                        hallFitsTime[2][lowercaseHalls.indexOf(myHalls[i].toLowerCase())] += i;
                    }

                    let optimalIdx = -1; //index of optimal hall (fits time and lowest ranking) in array
                    for (let i = 0; i<5; i++){
                        if (hallFitsTime[1][i]){
                            if (optimalIdx < 0){
                                optimalIdx = i;
                            }else if(hallFitsTime[2][i] < hallFitsTime[2][optimalIdx]){
                                optimalIdx = i;
                            }
                        }
                    }
                    meetHall = hallFitsTime[0][optimalIdx]; //get name of optimal hall

                    // create the modified match
                    const realMatch = {
                        'userid': timeMatches[0].userid,
                        'date': req.query.date,
                        'times': posTimes,
                        'halls': [meetHall],
                        'confirmed': false, // whether or not the dinner was confirmed
                    };
                    res.send(realMatch);
                    
                } else {
                  res.send({message: "Sorry! No matches yet. Check back soon!"})
                }
            } else {
                res.send({message: "Sorry! No matches yet. Check back soon!"})
            }
        } else {
            res.send({message: "Sorry! No matches yet. Check back soon!"});
        }
    });
});

// match step 1: post your request
router.post('/matchPost', 
    connect.ensureLoggedIn(),
    function(req, res) {
        const newMatchRequest = new MatchRequest({
            'userid': req.body.userid,
            'date': req.body.date,
            'halls': req.body.halls,
            'times': req.body.times,
        });

        newMatchRequest.save(function(err,mr) {
            if (err) console.log(err);
        });

        res.send(newMatchRequest);       
    }
);

// edit different aspects of a user's profile
// source: https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4
router.post('/editProfile/',
  connect.ensureLoggedIn(),
  function(req,res) {
    // req.dataType contains the parameters of the changed things

    console.log(req.body.data);
    User.findOneAndUpdate({ _id: req.body.data._id},
      req.body.data, function(err, user) { 
        if (err) {// if error 
           console.log(err)
           res.send(err);
           return;
         }
         console.log("about to respond")
         res.json({ message: 'User updated!' });
    });
  }
);

router.post('/addMatch/',
    connect.ensureLoggedIn(),
    function (req,res) {
        User.findOne({_id: req.body.userid}, function(err, user) {
            if (err) {
                console.log(err);
                res.send(err);
                return;
            }

            user.matches.push(req.body.m); // push the match

            user.save(function(err) { // save the user
                if (err) { // if error
                    console.log(err);
                    res.send(err);
                    return;
                }
                res.json({ message: 'User updated!' });
            });
        });
    });

// confirm a pending match
router.post('/confirmMatch/',
    connect.ensureLoggedIn(),
    function(req, res) {
        User.findOne({_id: req.body.userid}, function(err, user) {
            console.log("The user of the matches page: ");
            console.log(user);
            if (err) {
                console.log(err);
                res.send(err);
                return;
            }

            // update the relevant match (date)
            // will later fix match making to only allow 1 match per day
            const mateIndex = findMatchByDate(user, req.body.date);

            console.log("Mateindex: " + mateIndex);
            if (mateIndex > -1) {
                const data = user.matches.splice(mateIndex,1);
                const updated = {
                    'userid': data[0].userid,
                    'date': data[0].date,
                    'times': data[0].times,
                    'halls': data[0].halls,
                    'confirmed': true,
                }
                user.matches.push(updated);
            }
            user.save(function(err) {
                if (err) {
                    console.log(err);
                    res.send(err);
                    return;
                }
                // check if your match confirmed
                User.findOne({_id: req.body.matchid}, function(err, match) {
                   if (err) {
                        console.log(err);
                        res.send(err);
                        return;
                    }
                    const mateIndex2 = findMatchByDate(match, req.body.date);
                    console.log("Your mealmate's copy of your request");
                    console.log(match.matches[mateIndex2]);
                    if (mateIndex > -1 && match.matches[mateIndex2].confirmed) {
                        res.json({message: true});
                    } else {
                        res.json({message: false});
                    }
                });
            });
        });
    });

// decline a pending match
router.post('/declineMatch/', connect.ensureLoggedIn(), function(req,res) {
    User.findOne({_id: req.body.userid}, function(err, user) {
        if (err) {
            console.log(err);
            res.send(err);
            return;
        }
        user = removeMatch(user, req.body.date);
        user.save(function(err) {
            if (err) {
                console.log(err);
                res.send(err);
                return;
            }
            // now update your match and send her an email
            User.findOne({_id: req.body.matchid}, function(err, match) {
                   if (err) {
                        console.log(err);
                        res.send(err);
                        return;
                    }
                    match = removeMatch(match, req.body.date);
                    match.save(function(err) {
                        if (err) {
                            console.log(err);
                            res.send(err);
                        return;
                        }
                        const data = {
                            receiverEmail: match.email,
                            subjectText: "[mealmate] One of your matches declined",
                            bodyText: "Sadly, it appears that one of your matches declined the invitation. Check your matches page for more details, and happy dining!"
                        }                    
                        sendEmail(data.receiverEmail, data.subjectText, data.bodyText, function() { console.log("woohoo"); });
                    });
                });
            // updated both users! We are done
            res.json({ message: "User updated!" });
        });
    });
});

function findMatchByDate(user, date) {
    const confirmDate = new Date(date);
    let mateIndex = -1;
    for (let i=0; i<user.matches.length; i++) {
        const d = new Date(user.matches[i].date);
        if (d <= confirmDate && d >= confirmDate) { // if same date
            mateIndex = i;
            console.log("found a relevant match!")
            break;
        }
    }

    return mateIndex;
}

function removeMatch(user, date) {
    // remove the relevant match
    mateIndex = findMatchByDate(user, date);

    if (mateIndex > -1) {
        user.matches.splice(mateIndex,1);
    }
    return user;
}

router.post('/uploadImage/', connect.ensureLoggedIn(), function(req, res) {
    console.log('hello',req.files);
    console.log('rip', req.body);

    addPhoto(req.body.photokey, req.files.profpic, function(){
        res.redirect('/u/edit?' +req.body.photokey);
    });

});

router.post('/emailSender/', connect.ensureLoggedIn(), function(req, res){
    sendEmail(req.body.data.receiverEmail, req.body.data.subjectText, req.body.data.bodyText, function(){
        res.send({ message: "Email send!" })
    });
})

// this should be a delete request but the error I'm getting is jank af
// http://mongoosejs.com/docs/api.html
/* router.post('/cleanReqDB/', function(req, res) {
    const today = new Date();
    MatchRequest.find({}, function(err, matches) { // get all matches
        for (let i=0; i<matches.length; i++) {
            if (matches[i].date < today) { // if the day of the match has passed
                console.log("wow");
                matches[i].remove() // 
            }
        }
    });
})*/

module.exports = router;
