function main(){
    const profileId = window.location.search.substring(1);
    get('/api/whoami', {}, function(user){
        renderNavbar(user);
    });
    get('/api/user', {'_id': profileId}, function(profileUser) {
        renderMatches(profileUser)
    });
}

main();