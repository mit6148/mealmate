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

    for (let i=0; i<user.matches.length; i++) {
        console.log("Yo what up");
        get('/api/user', { '_id': user.matches[i].userid }, function (mUser) {
            carouselObjects.appendChild(makeCarouselObject(user.matches[i], mUser));
        });
        carouselIndicators.appendChild(makeCarouselIndicator(i));
    }
}

// make a carousel object
function makeCarouselObject(match, mUser) {
    /*  <div class="item">
            <img src="/static/img/bean_burger.jpg">
            <div class="carousel-caption">
                <h1 class="chewy closer-caption">DELICIOUS BEAN BURGER WITH A LONG NAME</h1> <!-- I can make it all caps later! just need name to be passed-->
                <h2 class="closer-caption">January 25, 2018</h2>
                <h2 class="closer-caption">2:30 pm</h2>
                <h2 class="closer-caption">Maseeh</h2>
                <button type="button" class="cannot-go">Cannot Go</button>
            </div>
        </div> */

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
        // create table
        // ----- LATER: FILTER THEM BY DATE ---------
        const matchTable = document.getElementById('t01')

        for (let i=0; i<user.matches.length; i++) {
            get('/api/user', { '_id': user.matches[i].userid }, function (matchedUser) {
                const tabrow = document.createElement('tr');

                const matchPic = document.createElement('td');
                const profileImage = document.createElement('img');
                profileImage.src = matchedUser.piclink;
                profileImage.onclick = function () { // propic is link to other user's page
                    document.location.href = '/u/profile?'+matchedUser._id;
                }
                matchPic.appendChild(profileImage);

                const matchName = document.createElement('td');
                const nameLink = document.createElement('a');
                nameLink.innerHTML = matchedUser.name;
                nameLink.setAttribute('href', '/u/profile?'+matchedUser._id);
                matchName.appendChild(nameLink);
                
                const matchDate = document.createElement('td');
                // tbh this date formatting is hacky
                matchDate.innerHTML = user.matches[i].date.substring(0,10);
                const matchTime = document.createElement('td');
                matchTime.innerHTML = formatTime(user.matches[i].times[0]); // just choose the first available time for now
                const matchHall = document.createElement('td');
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
        const breakMatch = document.createElement('br');
        const noMatch = document.createElement('p');
        noMatch.innerHTML = 'No matches yet! Check back soon.';
        matchTableDiv.appendChild(breakMatch);
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