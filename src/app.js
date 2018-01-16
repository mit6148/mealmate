const http = require('http');
const express = require('express');

const app = express();

//local dependencies
const db = require('./db');

app.get('/', function(req, res) {
  res.sendFile('index.html', { root: 'views' });
});

// route to profile
app.get('/profile', function(req, res) {
  res.sendFile('profile.html', { root: 'views' });
});

app.get('/matches', function(req, res) {
  res.sendFile('matches.html', { root: 'views' });
});

const port = 3000;
const server = http.Server(app);
server.listen(port, function() {
  console.log('Server running on port: ' + port);
});