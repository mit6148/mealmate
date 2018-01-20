function main(){
    const profileId = window.location.search.substring(1);
    get('/api/whoami', {}, function(user){
        renderNavbar(user);
    });
    get('/api/user', {'_id': profileId}, function(profileUser) {
        renderMatches(profileUser)
    });
}

// render Matches
function renderMatches(user) {

    const matchTableDiv = document.getElementById('matchTable');

    if (user.matches.length) { // if the user has matches
        // create table
        const matchTable = document.createElement('table')
        matchTable.setAttribute('id', 't01');

        // render matches in table
        for (let i=0; i<user.matches.length; i++) {
            matchTable.appendChild(renderMatch(user.matches[i]));
        }
        matchTableDiv.appendChild(matchTable);
    } else { // don't display a table if no matches
        const noMatch = document.createElement('p');
        noMatch.innerHTML = 'No matches yet! Check back soon.';
        matchTableDiv.appendChild(noMatch);
    }
}

// render a single match
// profile picture, name, time, and dining hall
function renderMatch(match) {
    const tabrow = document.createElement('tr');

    // step 1: hardcode
    const matchPic = document.createElement('th');
    matchPic.innerHTML = ":D";
    const matchName = document.createElement('th');
    matchName.innerHTML = ":D";
    const matchDate = document.createElement('th');
    matchDate.innerHTML = "Mon Jan 1 2000";
    const matchTime = document.createElement('th');
    matchTime.innerHTML = "5:30 pm";
    const matchHall = document.createElement('th');
    matchHall.innerHTML = "The best dining hall";

    tabrow.appendChild(matchPic);
    tabrow.appendChild(matchName);
    tabrow.appendChild(matchDate);
    tabrow.appendChild(matchTime);
    tabrow.appendChild(matchHall);

    return tabrow
    /*get('/api/user', { '_id': match.userid }, function (user) {

    });*/
}

main();