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
                profileImage.src = matchedUser.piclink;
                profileImage.onclick = function () { // propic is link to other user's page
                    document.location.href = '/u/profile?'+matchedUser._id;
                }
                matchPic.appendChild(profileImage);

                const matchName = document.createElement('th');
                const nameLink = document.createElement('a');
                nameLink.innerHTML = matchedUser.name;
                nameLink.setAttribute('href', '/u/profile?'+matchedUser._id);
                matchName.appendChild(nameLink);
                
                const matchDate = document.createElement('th');
                // tbh this date formatting is hacky
                console.log("This is the ith user match: ");
                matchDate.innerHTML = user.matches[i].date.substring(0,10);
                const matchTime = document.createElement('th');
                matchTime.innerHTML = formatTime(user.matches[i].times[0]); // just choose the first available time for now
                const matchHall = document.createElement('th');
                matchHall.innerHTML = user.matches[i].halls[0];

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

// formats the text inside the time column properly
function formatTime(t) {

    let ending = "am";
    let floatT = parseFloat(t);
    if (floatT >= 12) {
        floatT -= 12;
        ending = "pm";
        if (floatT === 0) {
            floatT = 12; // midnight will never be an option
        } else if (floatT === 0.5) {
            floatT = 12.5;
        }
    }

    if (Number.isInteger(floatT)) { // :00
        return "" + floatT + ":00 " + ending;
    }
    return "" + parseInt(floatT) + ":30 " + ending;
}

main();