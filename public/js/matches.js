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
        renderPendingMatches(profileUser);
        renderConfirmedMatches(profileUser);
    });
}

// render carousel matches
function renderConfirmedMatches(user) {

    const carouselObjects = document.getElementById('carousel-inner-objects');
    const carouselIndicators = document.getElementById('indicators');
    let count = 0;
    let isConfirmed = false;
    let isActive = true;
    const today = new Date(); today.setHours(0,0,0,0);

    //get the total number of confirmed and count down when assign since need to prepend
    for (let i=0; i < user.matches.length; i++){
        const matchDate = new Date(user.matches[i].date);
        if (user.matches[i].confirmed && matchDate >= today) {
            count ++;
        }
    }
    count --; //start indexing count from 0

    for (let i=user.matches.length-1; i>-1; i--) {
        console.log(user.matches.length);
        console.log("Yo what up");
        // only get match and make carousel object if match is confirmed
        const matchDate = new Date(user.matches[i].date);
        if (user.matches[i].confirmed && matchDate >= today) {
            isConfirmed = true;
            get('/api/user', { '_id': user.matches[i].userid }, function (mUser) {
                //carouselObjects.innerHTML = makeCarouselObject(user.matches[i], mUser);
                //makeCarouselObject(user.matches[i], mUser).appendTo(carouselObjects);
                var carouselObj = makeCarouselObject(user, user.matches[i], mUser);
                //const indic = makeCarouselIndicator(count);
                const indic = makeCarouselIndicator(count);
                //if first carouselobj, needs to be active to display
                if (isActive){ // first carouselobj to be added is active
                    carouselObj.className = "item active";
                    isActive = false;
                    indic.className = "active";
                }
                carouselObjects.prepend(carouselObj);
                carouselIndicators.prepend(indic);
                count--;
            });
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
function makeCarouselObject(user, match, mUser) {

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

    const flakeButton = document.createElement('button');
    flakeButton.setAttribute('type', 'button');
    flakeButton.className = "cannot-go red-decline";
    flakeButton.innerHTML = "Cannot Go";
    $(flakeButton).click(function() {
        $('#cancel-modal').show();

        $('#cancel-decline').click(function() {
            $('#cancel-modal').hide();
        });
        $('#verify-decline').click(function() {
            const matchDate = new Date(match.date);
            declineMatch(user, mUser, matchDate);
            // console.log("code to delete match");
            $('#cancel-modal').hide();
        });
    });

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
    caption.appendChild(flakeButton);
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

function renderPendingMatches(user) {
    if (user.matches.length) { // if the user has matches
        const today = new Date(); today.setHours(0,0,0,0);
        let arePendMatches = false;

        for (let i=0; i<user.matches.length; i++) {
            const matchDate = new Date(user.matches[i].date);
            if (matchDate >= today && !user.matches[i].confirmed) { // days after today or today
                arePendMatches = true;
                console.log("screaming sheep");
                get('/api/user', { '_id': user.matches[i].userid }, function(matchedUser) {
                    renderPendRow(user, matchedUser, user.matches[i]);
                });
            }
        }

        // if no outdated matches to display
        if (!arePendMatches) {
            const matchTableDiv = document.getElementById('pendDiv')
            const breakMatch = document.createElement('br');
            const noMatch = document.createElement('p');
            noMatch.innerHTML = 'You responded to all of your invitations! Woohoo!';
            matchTableDiv.appendChild(breakMatch);
            matchTableDiv.appendChild(noMatch);
        }

    } else { // don't display a table if no matches
        const matchTableDiv = document.getElementById('pendDiv')
        const breakMatch = document.createElement('br');
        const noMatch = document.createElement('p');
        noMatch.innerHTML = 'No mealmates yet! Check back soon';
        matchTableDiv.appendChild(breakMatch);
        matchTableDiv.appendChild(noMatch);
    }    
}

function renderPendRow(you, user, match) {
    console.log("screaming pigs!");
    const pendTable = document.getElementById('pendTable');
    const tabrow = document.createElement('tr');
    pendTable.appendChild(tabrow);

    // image and name, both links
    const imgName = document.createElement('td');
    const profileImage = document.createElement('img');
    profileImage.src = user.piclink;
    profileImage.className = "restrict-width center-block small-padding";
    profileImage.onclick = function () { // propic is link to other user's page
        document.location.href = '/u/profile?'+user._id;
    }
    imgName.appendChild(profileImage);

    const nameLink = document.createElement('p');
    const name = document.createElement('a');
    name.innerHTML = user.name;
    nameLink.className = "text-center";
    name.setAttribute('href', '/u/profile?'+user._id);
    nameLink.appendChild(name);
    imgName.appendChild(nameLink);

    // date, time, location
    const details = document.createElement('td');
    const date = document.createElement('p');
    date.className = "text-center";
    date.innerHTML = match.date.substring(0,10);
    const matchTime = document.createElement('p');
    matchTime.className = "text-center";
    matchTime.innerHTML = formatTime(match.times[0]);
    const hall = document.createElement('p');
    hall.className = "text-center";
    hall.innerHTML = match.halls[0];
    console.log(match.halls[0]);
    details.appendChild(date);
    details.appendChild(matchTime);
    details.appendChild(hall);

    // decision buttons
    const decision = document.createElement('td');
    const confirm = document.createElement('button');
    confirm.setAttribute('type', 'button');
    confirm.className = 'btn btn-default green-btn center-block confirm-match';
    confirm.innerHTML = "Confirm";
    confirm.addEventListener('click', function() {
        const matchDate = new Date(match.date);
        const data = {
            userid: you._id,
            matchid: user._id,
            date: matchDate
        }
        post('/api/confirmMatch', data, function(didMatchConfirm) {
            console.log(didMatchConfirm.message);
            if (didMatchConfirm.message) {
                alert("Match confirmed! Enjoy your meal!")
            } else {
                alert("Your match hasn't confirmed that they are able to go yet. You will receive an email if your match cannot go.");
            }
        });
    });
    const decline = document.createElement('button');
    decline.setAttribute('type', 'button');
    decline.className = "btn btn-default green-btn center-block red-decline";
    decline.innerHTML = "Decline"
    decline.addEventListener('click', function() {
        const matchDate = new Date(match.date);
        declineMatch(you, user, matchDate);
    })
    decision.appendChild(confirm);
    decision.appendChild(decline);

    tabrow.appendChild(imgName);
    tabrow.appendChild(details);
    tabrow.appendChild(decision);
    return pendTable;
}

// event listener for the pending confirm button
function confirmMatch(user, mUser, date) {
    console.log("inside confirmMatch");
    const data = {
        userid: user._id,
        matchid: mUser._id,
        date: date
    }

    post('/api/confirmMatch', data);
}

// event listener for the pending decline button
function declineMatch(user, mUser, date) {
    console.log("inside declineMatch");
    const data = {
        userid: user._id,
        matchid: mUser._id,
        date: date
    }
    post('/api/declineMatch', data);
}

// render old (out of date) matches
function renderOldMatches(user) {

    if (user.matches.length) { // if the user has matches
        const today = new Date()
        today.setHours(0,0,0,0);
        let werePrevMatches = false;

        for (let i=0; i<user.matches.length; i++) {
            const matchDate = new Date(user.matches[i].date);
            if (matchDate < today) {
                werePrevMatches = true;
                get('/api/user', { '_id': user.matches[i].userid }, function(matchedUser) {
                    renderOldRow(matchedUser, user.matches[i]);
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
        noMatch.innerHTML = 'You have no previous matches! Matches will show up here once the day of your meal has passed.';
        matchTableDiv.appendChild(breakMatch);
        matchTableDiv.appendChild(noMatch);
    }
}

function renderOldRow(mUser, match) {
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