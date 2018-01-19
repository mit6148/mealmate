function main() {
    const profileId = window.location.search.substring(1);
    get('/api/user', {'_id': profileId}, function(profileUser) {
        // all of these functions are now in submit.js
        renderUserData(profileUser);
    });
    get('/api/whoami', {}, function(user){
        renderNavbar(user);
    });     
}

main();