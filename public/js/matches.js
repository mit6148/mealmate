function main(){
    const profileId = window.location.search.substring(1);
    get('/api/whoami', {}, function(user){
        if (user._id === undefined){
            document.location.href = '/';
        }
        renderNavbar(user);
    });
    get('/api/user', {'_id': profileId}, function(profileUser) {
        renderOldMatches(profileUser);
        renderConfirmedMatches(profileUser);
    });
    $('.red-decline').click(function() {
        $('#cancel-modal').show();

        $('#cancel-decline').click(function() {
            $('#cancel-modal').hide();
        });
        $('#verify-decline').click(function() {
            //code to delete match
            console.log("code to delete match");
            $('#cancel-modal').hide();
        });
    });
}

// render carousel matches
// ------------- right now just display all matches -----------------
// ------------- later check if the match is "confirmed" ------------
// ------------- ALSO LATER display alternative slide if no matches yet (see html) ---
function renderConfirmedMatches(user) {

    const carouselObjects = document.getElementById('carousel-inner-objects');
    const carouselIndicators = document.getElementById('indicators');
    let count = 0;
    let isConfirmed = false;

    for (let i=0; i<user.matches.length; i++) {
        console.log("Yo what up");
        // only get match and make carousel object if match is confirmed
        if (user.matches[i].confirmed) {
            console.log("wheeeeeeee");
            isConfirmed = true;
            get('/api/user', { '_id': user.matches[i].userid }, function (mUser) {
                //carouselObjects.innerHTML = makeCarouselObject(user.matches[i], mUser);
                //makeCarouselObject(user.matches[i], mUser).appendTo(carouselObjects);
                var carouselObj = makeCarouselObject(user.matches[i], mUser);
                //if first carouselobj, needs to be active to display
                if (i === 0){
                    carouselObj.className = "item active";
                }
                carouselObjects.append(carouselObj);
            });
            carouselIndicators.append(makeCarouselIndicator(count));
            count++;
        }
    }

    // if there are no confirmed matches, display the "no matches" slide
    if (!isConfirmed) {
        console.log("No confirmed matches");
        carouselObjects.append(makeNoMatch());
    }
}

// make a carousel object indicating no confirmed matches
function makeNoMatch() {
    const it = document.createElement('div');
    it.className = "item active";

    const caption = document.createElement('div');
    caption.className="carousel-caption";

    const text = document.createElement('h1');
    text.className = "chewy closer-caption";
    text.innerHTML = "NO CONFIRMED MATCHES YET";

    const details = document.createElement('h1');
    details.className = "chewy";
    details.innerHTML = "pending matches that have been confirmed will appear here";

    it.appendChild(caption);
    caption.appendChild(text);
    caption.appendChild(details);

    return it;

}

// make a carousel object
function makeCarouselObject(match, mUser) {

    console.log("Making a carousel object, theoretically");

    const it = document.createElement('div');
    it.className = "item";

    const caption = document.createElement('div');
    caption.className="carousel-caption";

    const mName = document.createElement('h1');
    mName.className = "chewy closer-caption";
    mName.innerHTML = mUser.name;

    const matchDate = document.createElement('h2');
    matchDate.className = "closer-caption";
    matchDate.innerHTML = match.date.substring(0,10);

    const matchTime = document.createElement('h2');
    matchTime.className = "closer-caption";
    matchTime.innerHTML = formatTime(match.times[0]);

    const matchHall = document.createElement('h2');
    matchHall.className = "closer-caption";
    matchHall.innerHTML = match.halls[0];

    if (mUser.hasOwnProperty('piclink')) {
        const backgroundImage = document.createElement('img');
        var picSrc = mUser.piclink;
        if (picSrc.includes("amazonaws")){
            picSrc = picSrc + "?" + new Date().getTime();
        }
        backgroundImage.src = picSrc;
        it.appendChild(backgroundImage);
    }
    
    it.appendChild(caption);
    caption.appendChild(mName);
    caption.appendChild(matchDate);
    caption.appendChild(matchTime);
    caption.appendChild(matchHall);
    return it;
}

function makeCarouselIndicator(num) {
    // <li data-target="#matches-pics" data-slide-to="0" class="active"></li>
    console.log("Making a carousel indicator");
    const indic = document.createElement('li');
    indic.setAttribute('data-target', "#matches-pics");
    indic.setAttribute('data-slide-to', ""+num);

    return indic;
}

// render old (out of date) matches
function renderOldMatches(user) {

    if (user.matches.length) { // if the user has matches
        const today = new Date()
        let werePrevMatches = false;

        for (let i=0; i<user.matches.length; i++) {
            const matchDate = new Date(user.matches[i].date);
            if (matchDate < today) {
                werePrevMatches = true;
                get('/api/user', { '_id': user.matches[i].userid }, function(matchedUser) {
                    renderMatchRow(matchedUser, user.matches[i]);
                });
            }
        }

        // if no outdated matches to display
        if (!werePrevMatches) {
            const matchTableDiv = document.getElementById('matchTable')
            const breakMatch = document.createElement('br');
            const noMatch = document.createElement('p');
            noMatch.innerHTML = 'You have no previous matches! Matches will show up here once the day of your meal has passed.';
            matchTableDiv.appendChild(breakMatch);
            matchTableDiv.appendChild(noMatch);
        }

    } else { // don't display a table if no matches
        const matchTableDiv = document.getElementById('matchTable')
        const breakMatch = document.createElement('br');
        const noMatch = document.createElement('p');
        noMatch.innerHTML = 'No matches yet! Check back soon.';
        matchTableDiv.appendChild(breakMatch);
        matchTableDiv.appendChild(noMatch);
    }
}

function renderMatchRow(mUser, match) {
    const matchTable = document.getElementById('t01')
    const tabrow = document.createElement('tr');

    const matchPic = document.createElement('td');
    const profileImage = document.createElement('img');
    profileImage.src = mUser.piclink;
    profileImage.onclick = function () { // propic is link to other user's page
        document.location.href = '/u/profile?'+mUser._id;
    }
    matchPic.appendChild(profileImage);

    const matchName = document.createElement('td');
    const nameLink = document.createElement('a');
    nameLink.innerHTML = mUser.name;
    nameLink.setAttribute('href', '/u/profile?'+mUser._id);
    matchName.appendChild(nameLink);
    
    const matchDate = document.createElement('td');
    // tbh this date formatting is hacky
    matchDate.innerHTML = match.date.substring(0,10);
    const matchTime = document.createElement('td');
    matchTime.innerHTML = formatTime(match.times[0]); // just choose the first available time for now
    const matchHall = document.createElement('td');
    matchHall.innerHTML = match.halls[0];

    tabrow.appendChild(matchPic);
    tabrow.appendChild(matchName);
    tabrow.appendChild(matchDate);
    tabrow.appendChild(matchTime);
    tabrow.appendChild(matchHall);
    matchTable.appendChild(tabrow);
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