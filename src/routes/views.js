//dependencies
const express = require('express');
const router = express.Router();

//public endpoints
router.get('/', function(req, res) {
  res.sendFile('index.html', { root: 'views' });
});

// route to profile
router.get('/profile', function(req, res) {
  res.sendFile('profile.html', { root: 'views' });
});

router.get('/matches', function(req, res) {
  res.sendFile('matches.html', { root: 'views' });
});

module.exports = router;