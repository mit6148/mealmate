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

    if (user.matches.length) { // if the user has matches
        // create table
        const matchTable = document.getElementById('t01')

        // render matches in table
        console.log("Here's matches: ")
        console.log(user.matches);
        for (let i=0; i<user.matches.length; i++) {
            get('/api/user', { '_id': user.matches[i].userid }, function (matchedUser) {
                const tabrow = document.createElement('tr');

                const matchPic = document.createElement('th');
                const profileImage = document.createElement('img');
                profileImage.src = 'https://graph.facebook.com/'+matchedUser.fbid+'/picture?type=large';
                matchPic.appendChild(profileImage);

                const matchName = document.createElement('th');
                matchName.innerHTML = matchedUser.name;
                const matchDate = document.createElement('th');
                // tbh this date formatting is hacky
                console.log("This is the ith user match: ");
                matchDate.innerHTML = user.matches[i].date.substring(0,10);
                const matchTime = document.createElement('th');
                matchTime.innerHTML = user.matches[i].times[0]; // just choose the first available time for now
                const matchHall = document.createElement('th');
                matchHall.innerHTML = user.matches[i].halls[0]; // choose first hall

                tabrow.appendChild(matchPic);
                tabrow.appendChild(matchName);
                tabrow.appendChild(matchDate);
                tabrow.appendChild(matchTime);
                tabrow.appendChild(matchHall);
                matchTable.appendChild(tabrow);
            });
        }

    } else { // don't display a table if no matches
        const matchTableDiv = document.getElementById('matchTable')
        const noMatch = document.createElement('p');
        noMatch.innerHTML = 'No matches yet! Check back soon.';
        matchTableDiv.appendChild(noMatch);
    }
}

main();