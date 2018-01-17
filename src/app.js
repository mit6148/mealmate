const http = require('http');
const express = require('express');

const app = express();

//local dependencies
const db = require('./db');
const views = require('./routes/views');

app.use('/', views);
// app.use('/api', api); // for when we're ready
app.use('/static', express.static('public'));

/*
app.get('/', function(req, res) {
  res.sendFile('index.html', { root: 'src/views' });
});

// route to profile
app.get('/profile', function(req, res) {
  res.sendFile('profile.html', { root: 'src/views' });
});

app.get('/matches', function(req, res) {
  res.sendFile('matches.html', { root: 'src/views' });
});
*/

//404 error handler
app.use(function(req, res, next){
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

//route error handler
app.use(function(err, req, res, next){
	res.status(err.status || 500);
	res.send({
		status: err.status,
		message: err.message,
	});
});

// port config
const port = 3000;
const server = http.Server(app);
server.listen(port, function() {
  console.log('Server running on port: ' + port);
});