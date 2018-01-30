const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function main(){
    const profileId = window.location.search.substring(1);
    get('/api/whoami', {}, function(user){
        if (user._id === undefined){
            document.location.href = '/';
        }
        renderNavbar(user);
    });
    //Populate the matched users when get user so confirmed matches add in order
    get('/api/user', {'_id': profileId, 'getMatches': true}, function(user) {
        const profileUser = user.user;
        renderOldMatches(profileUser);
        renderPendingMatches(profileUser);
        renderConfirmedMatches(profileUser);
    });
}

// render carousel matches
function renderConfirmedMatches(user) {

    const carouselObjects = document.getElementById('carousel-inner-objects');
    const carouselIndicators = document.getElementById('indicators');
    const today = new Date(); today.setHours(0, 0, 0, 0);

    let confirmedMatchesArr = countConfirmed(user);

    //Compare dates source: https://stackoverflow.com/questions/492994/compare-two-dates-with-javascript
    confirmedMatchesArr.sort(function(a, b) {
        const aDate = new Date(a.date);
        const bDate = new Date(b.date);
        return (aDate > bDate) - (aDate < bDate);
    });
    
    for (let i = confirmedMatchesArr.length-1; i >= 0; i--){
        console.log(confirmedMatchesArr[i]);
        const mUser = confirmedMatchesArr[i].userid;
        var carouselObj = makeCarouselObject(user, confirmedMatchesArr[i], mUser);
        var indic = makeCarouselIndicator(i);
        //if first carouselobj, needs to be active to display
        if (!i){ // first carouselobj in list is active
            carouselObj.className = "item active";
            indic.className = "active";
        }
        carouselObjects.prepend(carouselObj);
        carouselIndicators.prepend(indic);
    }

    // if there are no confirmed matches, display the "no matches" slide
    if (confirmedMatchesArr.length === 0) {
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
    text.className = "chewy";
    text.innerHTML = "NO MEALMATES YET!";

    const details = document.createElement('h2');
    details.innerHTML = "Matches will appear here after being confirmed by you and your match.";

    it.appendChild(caption);
    caption.appendChild(text);
    caption.appendChild(details);

    return it;
}

// make a carousel object
function makeCarouselObject(user, match, mUser) {

    const it = document.createElement('div');
    it.className = "item";

    const caption = document.createElement('div');
    caption.className="carousel-caption";

    const mName = document.createElement('h1');
    mName.className = "chewy closer-caption";

    const mProfLink = document.createElement('a');
    mName.appendChild(mProfLink);
    mProfLink.innerHTML = mUser.name;
    mProfLink.setAttribute('href', '/u/profile?'+mUser._id);

    const matchDate = document.createElement('h3');
    matchDate.className = "closer-caption";
    const dateObj = new Date(match.date);
    matchDate.innerHTML = DAYS[dateObj.getDay()] + ', ' + MONTHS[dateObj.getMonth()] + ' ' + dateObj.getDate();

    const matchTime = document.createElement('h3');
    matchTime.className = "closer-caption";
    matchTime.innerHTML = formatTime(match.times[0]);

    const matchHall = document.createElement('h3');
    matchHall.className = "closer-caption";
    matchHall.innerHTML = match.halls[0];

    const flakeButton = document.createElement('button');
    flakeButton.setAttribute('type', 'button');
    flakeButton.className = "cannot-go red-decline";
    flakeButton.innerHTML = "Cannot Go";
    $(flakeButton).click(function() { //When decline a confirmed match
        console.log('mUser', mUser);
        console.log('user', user);
        console.log(mUser.email);
        $('#cancel-modal').show();

        $('#cancel-decline').click(function() {
            $('#cancel-modal').hide();
        });
        $('#verify-decline').click(function() {
            const matchDate = new Date(match.date);
            const emailText = cancelledMealmateEmail.replace('Hello', 'Hello ' + mUser.name.split(' ')[0])
                .replace('looks like', 'looks like ' + user.name.split(' ')[0]); //email templates in emailTemplates.js
            declineMatch(user, mUser, matchDate, "[mealmate] Your mealmate cancelled...", emailText, -1);
            
            console.log(mUser.email);
/*
            post('/api/emailSender', { data }, function () {
                $('#cancel-modal').hide();
                //document.location.href = '/u/matches?'+user._id;
            });
*/
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
    const indic = document.createElement('li');
    indic.setAttribute('data-target', "#matches-pics");
    indic.setAttribute('data-slide-to', ""+num);

    return indic;
}

function countConfirmed(user) {
    var confirmedArr = [];
    let today = new Date(); today.setHours(0,0,0,0);
    for (let i = 0; i < user.matches.length; i++){
        const matchDate = new Date(user.matches[i].date);
        if (user.matches[i].confirmed && matchDate >= today){
            confirmedArr.push(user.matches[i]);
        }
    }
    return confirmedArr;
}

function renderPendingMatches(user) {
    if (user.matches.length) { // if the user has matches
        const today = new Date(); today.setHours(0,0,0,0);
        let arePendMatches = false;

        for (let i=0; i<user.matches.length; i++) {
            console.log(user.matches[i].date);
            const matchDate = new Date(user.matches[i].date);
            if (matchDate >= today && !user.matches[i].confirmed) { // days after today or today
                arePendMatches = true;
                const matchedUser = user.matches[i].userid
                renderPendRow(user, matchedUser, user.matches[i], i);
            }
        }

        // if no outdated matches to display
        if (!arePendMatches) {
            const matchTableDiv = document.getElementById('pendDiv')
            const breakMatch = document.createElement('br');
            const noMatch = document.createElement('h3');
            noMatch.innerHTML = 'You responded to all of your invitations! Woohoo!';
            matchTableDiv.appendChild(breakMatch);
            matchTableDiv.appendChild(noMatch);
        }

    } else { // don't display a table if no matches
        const matchTableDiv = document.getElementById('pendDiv')
        const breakMatch = document.createElement('br');
        const noMatch = document.createElement('h3');
        noMatch.innerHTML = 'No pending matches yet! Check back soon.';
        matchTableDiv.appendChild(breakMatch);
        matchTableDiv.appendChild(noMatch);
    }    
}

function renderPendRow(you, user, match, num) {
    const pendTable = document.getElementById('pendTable');
    const tabrow = document.createElement('tr');
    tabrow.setAttribute('id', 'pending-row'+num);
    pendTable.appendChild(tabrow);

    // image and name, both links
    const imgName = document.createElement('td');
    const profileImage = document.createElement('img');
    profileImage.src = user.piclink;
    profileImage.className = "restrict-width center-block small-padding match-picture";
    profileImage.onclick = function () { // propic is link to other user's page
        document.location.href = '/u/profile?'+user._id;
    }
    imgName.appendChild(profileImage);

    const nameLink = document.createElement('p');
    const name = document.createElement('a');
    name.innerHTML = user.name;
    name.className = "match-name";
    nameLink.className = "text-center";
    name.setAttribute('href', '/u/profile?'+user._id);
    nameLink.appendChild(name);
    imgName.appendChild(nameLink);

    // date, time, location
    const details = document.createElement('td');
    const date = document.createElement('p');
    date.className = "text-center";
    const dateObj = new Date(match.date);
    date.innerHTML = DAYS[dateObj.getDay()] + ', ' + MONTHS[dateObj.getMonth()] + ' ' + dateObj.getDate();
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
    const breakButton = document.createElement('br');
    confirm.setAttribute('type', 'button');
    confirm.className = 'btn btn-default green-btn center-block confirm-match border-black';
    confirm.innerHTML = "Confirm";
    confirm.addEventListener('click', function() {
        confirmMatch(you, user, match, num);
    });
    const decline = document.createElement('button');
    decline.setAttribute('type', 'button');
    decline.className = "btn btn-default green-btn center-block red-decline border-black";
    decline.innerHTML = "Decline"
    decline.addEventListener('click', function() { //When decline a pending match
        console.log('pending you', you);
        console.log('pending user', user);
        $('#decline-match-modal').show();

        $('#cancel-no-match').click(function(){
            $('#decline-match-modal').hide();
        });
        $('#verify-no-match').click(function(){
            const matchDate = new Date(match.date);
            const emailText = declinedMatchEmail.replace('Hello', 'Hello ' + user.name.split(' ')[0])
                .replace('looks like', 'looks like ' + you.name.split(' ')[0]); //email templates in emailTemplates.js
            declineMatch(you, user, matchDate, "[mealmate] One of your matches cannot go...", emailText, num);
            $('#decline-match-modal').hide();
        });
    });
    decision.appendChild(confirm);
    decision.appendChild(breakButton);
    decision.appendChild(decline);

    tabrow.appendChild(imgName);
    tabrow.appendChild(details);
    tabrow.appendChild(decision);
    return pendTable;
}

// event listener for the pending confirm button
function confirmMatch(user, mUser, match, num) {
    console.log("inside confirmMatch");
    const matchDate = new Date(match.date);
    const data = {
        userid: user._id,
        matchid: mUser._id,
        date: matchDate
    }

    post('/api/confirmMatch', data, function(didMatchConfirm) {
        console.log(didMatchConfirm.message);
        if (didMatchConfirm.message) {

            var data = {
                receiverEmail: user.email,
                subjectText: "[mealmate] New mealmate!",
                bodyText: newMealmateEmail.replace('Hello', 'Hello ' + user.name.split(' ')[0])
                    .replace('You and', 'You and ' + mUser.name.split(' ')[0]) //email templates in emailTemplates.js
            }
            post('/api/emailSender', { data }, function () {
                console.log("new mealmate email sent to first user");
            });

            data = {
                receiverEmail: mUser.email,
                subjectText: "[mealmate] New mealmate!",
                bodyText: newMealmateEmail.replace('Hello', 'Hello ' + mUser.name.split(' ')[0])
                    .replace('You and', 'You and ' + user.name.split(' ')[0]) //email templates in emailTemplates.js
            }
            post('/api/emailSender', { data }, function () {
                alert("Match confirmed! Enjoy your meal!"); // done
            });

        } else {
            alert("Your match hasn't confirmed that they are able to go yet. You will receive an email if your match cannot go.");
        }
        // first, create the corresponding carousel object
        const carouselObjects = document.getElementById('carousel-inner-objects');
        const carouselIndicators = document.getElementById('indicators');
        const newConfirmed = makeCarouselObject(user, match, mUser);
        const count = countConfirmed(user);
        const indic = makeCarouselIndicator(count-1);

        carouselObjects.prepend(newConfirmed); carouselIndicators.prepend(indic)

        // then, delete the row!
        const pendRow = document.getElementById('pending-row'+num);
        pendRow.remove(); // woot

        document.location.href = '/u/matches?'+user._id;
    });
}

// event listener for the confirmed and pending decline button
function declineMatch(user, mUser, matchDate, emailTitle, emailText, num) {
    console.log("inside declineMatch");
    const data = {
        userid: user._id,
        matchid: mUser._id,
        date: matchDate,
        emailsubject: emailTitle,
        emailcontent: emailText
    }
    post('/api/declineMatch', data, function() {
        if (num < 0){  //from delete confirmed match --> refresh
            document.location.href = '/u/matches?'+user._id;

        }else{ // just delete the row when decline pending match
            const pendRow = document.getElementById('pending-row'+num);
            pendRow.remove(); // woot
        }
    });
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
                const matchedUser = user.matches[i].userid;
                renderOldRow(matchedUser, user.matches[i]);
            }
        }

        // if no outdated matches to display
        if (!werePrevMatches) {
            const matchTableDiv = document.getElementById('matchTable')
            const breakMatch = document.createElement('br');
            const noMatch = document.createElement('h3');
            noMatch.innerHTML = 'You have no previous mealmates! Past mealmates will show up here once the day of your meal has passed.';
            matchTableDiv.appendChild(breakMatch);
            matchTableDiv.appendChild(noMatch);
        }

    } else { // don't display a table if no matches
        const matchTableDiv = document.getElementById('matchTable')
        const breakMatch = document.createElement('br');
        const noMatch = document.createElement('h3');
        noMatch.innerHTML = 'You have no previous mealmates! Past mealmates will show up here once the day of your meal has passed.';
        matchTableDiv.appendChild(breakMatch);
        matchTableDiv.appendChild(noMatch);
    }
}

function renderOldRow(mUser, match) {
    const matchTable = document.getElementById('t01')
    const tabrow = document.createElement('tr');
    const breakMatch = document.createElement('br');

    //start of "match" column
    const matchPic = document.createElement('td');
    matchPic.className = "text-center";
    
    //picture of past match
    const profileImage = document.createElement('img');
    profileImage.className = "match-picture small-padding restrict-width"
    profileImage.src = mUser.piclink;
    profileImage.onclick = function () { // propic is link to other user's page
        document.location.href = '/u/profile?'+mUser._id;
    }
    
    //name of past match
    const nameLink = document.createElement('p');
    const name = document.createElement('a');
    name.innerHTML = mUser.name;
    nameLink.className = "text-center";
    name.className = "match-name";
    name.setAttribute('href', '/u/profile?'+mUser._id);
    nameLink.appendChild(name);
    
    matchPic.appendChild(profileImage);
    matchPic.appendChild(breakMatch);
    matchPic.appendChild(nameLink);
    //end of "match" column
    
    //start of "details" column
    const matchDate = document.createElement('td');
    matchDate.className = "text-center";    
    const date = document.createElement('p');
    date.className = "text-center";
    const dateObj = new Date(match.date);
    matchDate.innerHTML = DAYS[dateObj.getDay()] + ', ' + MONTHS[dateObj.getMonth()] + ' ' + dateObj.getDate();
    const matchTime = document.createElement('p');
    matchTime.className = "text-center";
    matchTime.innerHTML = formatTime(match.times[0]);
    const hall = document.createElement('p');
    hall.className = "text-center";
    hall.innerHTML = match.halls[0];
    console.log(match.halls[0]);
    matchDate.appendChild(date);
    matchDate.appendChild(matchTime);
    matchDate.appendChild(hall);

    tabrow.appendChild(matchPic);
    tabrow.appendChild(matchDate);
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