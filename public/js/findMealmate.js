const t = ['8', '8.5', '9','9.5','10','10.5','11','11.5','12','12.5','13','13.5','14','14.5',
           '17','17.5','18','18.5','19','19.5','20','20.5'];

function main(){
    const profileId = window.location.search.substring(1);

    $('#datepicker').datepicker({
        autoclose: true,
        todayHighlight: true
    }).datepicker('update', new Date(2018, 0, 1)); // nice jQuery

    get('/api/whoami', {}, function(user){
        if (user._id === undefined){
            document.location.href = '/';
        }
        renderNavbar(user);
    });
    get('/api/user', {'_id': profileId}, function(profileUser) {
    //    renderMatches(profileUser)

        const matchButton = document.getElementById('find-mealmate-button');
    	matchButton.addEventListener('click', function() {
	        const date = $('#datepicker').datepicker('getDate'); 
	        const selectedTimes = getSelectedTimes();
	        const hallRankings = getHallRankings();
	        getMatch(profileUser, date, selectedTimes, hallRankings);
	    });
    });
}

// gets the times selected
function getSelectedTimes() {
    // check every checkbox dom object for whether it is checked
    let selectedTimes = [];
    for (let i=0; i<t.length; i++) {
        const checkBox = document.getElementById("check"+t[i]);
        if (checkBox.checked) {
            console.log("Checked time: check"+t[i]);
            selectedTimes.push(t[i]);
        };
    }
    return selectedTimes;
}

// gets the top 3 halls in the ordered list object
// function getTopThreeHalls() {
//     // jQuery source: http://jsfiddle.net/LcBAQ/
    
//     let topThreeHalls = [];
//     for (let i=0; i<3; i++) {
//         topThreeHalls.push($('#userDiningPreferences li:eq(' + i + ')').text());
//     }

//     console.log(topThreeHalls);
//     return topThreeHalls
// }

function getHallRankings() {
    
    let hallRankings= [];
    for (let i=0; i<5; i++) {
        hallRankings.push($('#userDiningPreferences li:eq(' + i + ')').text());
    }

    console.log(hallRankings);
    return hallRankings;
}

function getMatch(user, d, ts, h) {
    const data = {
        userid: user._id,
        date: d,
        times: ts,
        halls: h
    };

    // post your request, and get a match!
    post('/api/matchPost', data, function (theMatch) { // return the user's request
        console.log("Your posted match request");
        console.log(theMatch);
        get('/api/matchRequest', {'userid': user._id, 'date': d, 'times': ts, 'halls': h}, function (match) {
            console.log("Your gotten match:");
            console.log(match);
            if (match.hasOwnProperty('times')) {
                updateUsersWithMatch(user, match, theMatch);
            } else {
                const data = {
                    receiverEmail: user.email,
                    subjectText: "[mealmate] No match yet...",
                    bodyText: "Sadly, no one was available in the time and day you requested. But keep checking your matches page, and watch your inbox!"
                }
                post('/api/emailSender', { data }, function () {
                    document.location.href = '/u/matches?'+user._id; // done
                });
                alert('Match submitted. You will get an email soon!');
            }
        });
    });
}

function updateUsersWithMatch(user, yourMatch, theirMatch) {

    console.log("Your match, or lack thereof: ")
    console.log(yourMatch);

    const matchData = { // to be posted to the user
        userid: user._id,
        m: yourMatch,
    }

    // create a modified version of their Match
    const modTheirMatch = {
        userid: theirMatch.userid,
        date: theirMatch.date,
        times: yourMatch.times, // shares same times as match
        halls: yourMatch.halls, // shares same hall as match
        confirmed: false // your match has also not confirmed
    }

    const matchData2 = { // to be posted to the match
        userid: yourMatch.userid,
        m: modTheirMatch,
    }

    // update the user and match with the match
    // console.log("nani");
    post('/api/addMatch', matchData, function() {
        sendEmailUser(user);
        // then email your match, and change pages
        post('/api/addMatch', matchData2, function() {
            sendEmailMatch(user, yourMatch);
        });
    });
}

// send email to user
function sendEmailUser(user) {
    const data = {
        receiverEmail: user.email,
        subjectText: "[mealmate] You have a match!",
        bodyText: "Check your matches page for your new match, and happy dining! :)"
    }
    post('/api/emailSender', { data });
    alert("Match submitted. You will get an email soon! Check your matches page");
}

function sendEmailMatch(user, match) {
    get('/api/user', { '_id': match.userid }, function (mUser) {
        const data = {
            receiverEmail: mUser.email,
            subjectText: "[mealmate] You have a match!",
            bodyText: "Check your matches page for your new match, and happy dining! :)"
        }
        post('/api/emailSender', { data }, function() {
            document.location.href = '/u/matches?'+user._id // done
        });
        // alert("Your match will get an email soon!");
    });
}

main();