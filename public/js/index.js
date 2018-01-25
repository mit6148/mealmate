function main() {
  // cleanReqDB(); // clean the requests database
  get('/api/whoami', {}, function(user) {
    console.log(user);
    renderNavbar(user);

    // activate the get-started button
    const startButton = document.getElementById('get-started');
    startButton.addEventListener('click', function f() {
      getStarted(user);
    });
  });
} 

// activates the get started button
function getStarted(user) { 
  // if no user, then log in button
  if (user._id === undefined) {
    document.location.href = '/auth/facebook';
  } else { // then it is a "go to profile button"
    document.location.href = '/u/profile?'+user._id;
  }
} 

// clean the request database
function cleanReqDB() {
  post('/api/cleanReqDB', {}, function(req,res) {
    console.log("Theoretically cleaned out the database of old times");
  });
}

main();