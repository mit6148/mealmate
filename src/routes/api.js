// dependencies
const express = require('express');
const connect = require('connect-ensure-login');

// models
const User = require('../models/user');
const MatchRequest = require('../models/matchRequest');

const router = express.Router();

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
                    console.log("hey it isn't yourself");
                    idMatches.push(matches[i]); // add that match
                }
            }

            console.log("meowmeow! " + idMatches);
            if (idMatches.length) {
                // filter by times
                const uTimes = req.query.times;
                console.log("Here is req.query.times: " + req.query.times);
                let timeMatches = [];
                for (let i=0; i<idMatches.length; i++) { // for each match
                    for (let j=0; j<uTimes.length; j++) { // for each of user's times
                        // if that time is inside the times for idMatches[i]
                        if (idMatches[i].times.includes(uTimes[j])) {
                            console.log("Here is an overlapping time: " + uTimes[j]);
                            console.log("This time was found in: ");
                            console.log(idMatches[i].times);
                            timeMatches.push(idMatches[i]);
                            break; // do not add duplicates
                        }
                    }
                }
                if (timeMatches.length) {
                    console.log("Here's a match request that works! ")
                    res.send(timeMatches[0]);
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
            'userid': req.user._id,
            'date': req.body.date,
            'halls': req.body.halls,
            'times': req.body.times,
        });

        newMatchRequest.save(function(err,mr) {
            if (err) console.log(err);
        });

        res.send({});       
    }
);

// edit different aspects of a user's profile
// source: https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4
router.post('/editProfile/',
  connect.ensureLoggedIn(),
  function(req,res) {
    // req.dataType contains the parameters of the changed things
    User.findOne({ _id: req.body._id}, function(err, user) {
      if (err) {
        res.send(err);
        return;
      }

      switch(req.body.dataType) {
        case "course": // change course and class year
          user.course = req.body.course;
          break;
        case "year":
          user.year = req.body.year;
          break;
        case "about": // change about me
          user.about = req.body.about;
          break;
        case "residence": // change residence
          user.residence = req.body.residence;
          break;
        case "matches":
          if (req.body.hasOwnProperty('m')) {
            user.matches.push(req.body.m); // append a match
          } 
          break;
        default:
          break; // no changes
      }

      console.log(user)
      // save the user
      user.save(function(err) {
        if (err) {// if error 
          console.log(err)
          res.send(err);
          return;
        }
        console.log("about to respond")
        res.json({ message: 'User updated!' });
      });

    });
  }
);

module.exports = router;
