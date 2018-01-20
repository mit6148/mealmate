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
    console.log("This is req.query.date: " + req.query.date);
    MatchRequest.find({ date: req.query.date }, function(err, matches) {
        if (err) { // log error
            console.log("Error " + err);
            res.send({message: "Sorry! No matches yet. Check back soon!"}); // error
        }
        // if there are matches, filter them by 
        // time, and requests NOT made by user (real awk to match with yourself)
        if (matches && matches.length) {
            /* const uTimes = req.query.times; // the user's times
            let timeMatches = [];
            for (let i=0; i<matches.length; i++) {

            } <--- write this later!! */
            console.log("meowmeow! " + matches);
            res.send(matches[0]); // return the first match
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
        case "course-year": // change course and class year
          user.course = req.body.course;
          user.year = req.body.year;
          break;
        case "about": // change about me
          user.about = req.body.about;
          break;
        case "residence": // change residence
          user.residence = req.body.residence;
          break;
        case "matches":
          user.matches.push(req.body.m);
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
