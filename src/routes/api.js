// dependencies
const express = require('express');
const connect = require('connect-ensure-login');

// models
const User = require('../models/user');
const MatchRequest = require('../models/matchRequest');

const router = express.Router();

const addPhoto = require('../pictures').addPhoto;
const sendEmail = require('../emailSender').sendEmail;

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
                    for (let i=0; i<3; i++) {
                        if (matchHalls.includes(myHalls[i])) {
                            meetHall = myHalls[i];
                            break;
                        }
                    }

                    // create the modified match
                    const realMatch = {
                        'userid': timeMatches[0].userid,
                        'date': req.query.date,
                        'times': posTimes,
                        'halls': [meetHall],
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
        // console.log("AAAAAAAAHHHHHHHHHHHHH");
        User.findOne({_id: req.body.userid}, function(err, user) {
            if (err) {
                console.log(err);
                res.send(err);
                return;
            }

            // console.log(user.matches);
            user.matches.push(req.body.m); // push the match
            // console.log("This is req.body.m: ");
            // console.log(req.body.m);

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

// this path does nothing but make functions into callback functions
router.post('/doNothing/', function(req,res) {
    console.log("Doing nothing~");
})

router.post('/uploadImage/', connect.ensureLoggedIn(), function(req, res) {
    console.log('hello',req.files);
    console.log('rip', req.body);

    addPhoto(req.body.photokey, req.files.profpic, function(){
        res.redirect('/u/edit?' +req.body.photokey);
    });
    if (err){
        console.log(err);
        res.send(err);
        return;
    }

});

router.post('/emailSender/', connect.ensureLoggedIn(), function(req, res){
    sendEmail(req.body.data.receiverEmail, req.body.data.subjectText, req.body.data.bodyText, function(){
        res.send({ message: "Email send!" })
    });
})

module.exports = router;
