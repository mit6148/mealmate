// dependencies
const express = require('express');
const connect = require('connect-ensure-login');

// models
const User = require('../models/user');

const router = express.Router();

// api endpoints
router.get('/whoami', function(req, res) {
  if (req.isAuthenticated()){
    res.send(req.user);
  } else{
    res.send({});
  }
});

router.get('/user', function(req, res) {
  User.findOne({ _id: req.query._id}, function(err, user){
    res.send(user);
  });
});

// edit different aspects of a user's profile
// source: https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4
router.put('/editProfile/:user_id',
  connect.ensureLoggedIn(),
  function(req,res) {
    // req.dataType contains the parameters of the changed things
    User.findOne(req.params._id, function(err, user) {
      if (err)
        res.send(err);

      switch(req.body.dataType) {
        case "course-year": // change course and class year
          user.course = req.body.course;
          user.year = req.body.year;
          break;
        case "about": // change about me
          user.about = req.body.about;
          break;
        default:
          break; // no changes
      }

      // save the user
      user.save(function(err) {
        if (err)
          res.send(err);

        res.json({ message: 'User updated!' });
      });

    });
  }
);

module.exports = router;
