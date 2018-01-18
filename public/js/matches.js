function main(){
    get('/api/whoami', {}, function(user){
        renderNavbar(user);
    });
    /*get('/api/user', {'_id': profileId}, function(profileUser) {

    });*/
}

// render Matches
// a work in progress. THIS FUNCTIONALITY HAS NOT BEEN ADDED TO THE WEBSITE YET.
function renderMatches(user) {

    const matchTable = document.getElementById('matchTable');

    if (user.matches) { // if the user has matches
        // create table
        for (let i=0; i<user.matches.length; i++) {
            matchTable.appendChild(renderMatch(user.matches[i]));
        }
    } else { // don't display a table if no matches
        const noMatch = document.createElement('p');
        noMatch.innerHTML = 'No matches yet! Check back soon.';
        matchTable.appendChild(noMatch);
    }
}

// render a single match
// profile picture, name, time, and dining hall
function renderMatch(match) {
    console.log("hi");
    return undefined;
}

main();