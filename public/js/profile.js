const t = ['9','9.5','10','10.5','11','11.5','12','12.5','13','13.5','14','14.5',
           '17','17.5','18','18.5','19','19.5','20','20.5'];

function main() {
    const profileId = window.location.search.substring(1);
    $('#datepicker').datepicker({
        autoclose: true,
        todayHighlight: true
    }).datepicker('update', new Date()); // nice jQuery

    get('/api/user', {'_id': profileId}, function(profileUser) {

        if (!(profileUser.email) || profileUser.email === ""){
            $('#emailModal').show();
            $('#submitEmail').click(function(){
                if ($('#userEmail').val().indexOf('@') > -1){
                    const data={
                        _id: profileUser._id,
                        email: $('#userEmail').val()
                    }
                    post('/api/editProfile', { data }, function(){
                        loadPage(profileUser);
                        $('#emailModal').hide();
                    });
                }else{
                    alert("Please enter a valid email!");
                }
/*
                else{
                    console.log("hi!");
                    loadPage(profileUser);
                    $('#emailModal').hide();
                }
                */
                
            });

        } else{
            loadPage(profileUser);
        }
    });
    get('/api/whoami', {}, function(user){
        renderNavbar(user);
    });

}

function loadPage(user){
    renderUserData(user);

    const matchButton = document.getElementById('find-mealmate-button');
    matchButton.addEventListener('click', function() {
        const date = $('#datepicker').datepicker('getDate'); 
        const selectedTimes = getSelectedTimes();
        const topThreeHalls = getTopThreeHalls();
        getMatch(user, date, selectedTimes, topThreeHalls);
        // document.location.href = '/u/matches?'+user._id;
    });

    // render the correct edit link
    const editButton = document.getElementById('editProfile');
    editButton.addEventListener('click', function() {
        document.location.href = '/u/edit?'+user._id;
    });
}

function renderUserData(user) {
    // rendering name
    const nameContainer = document.getElementById('userName');
    const nameHeader = document.createElement('h1');
    nameHeader.innerHTML = user.name;
    nameContainer.appendChild(nameHeader);

    // rendering profile image
    const profileImage = document.createElement('img');
    document.getElementById('userImage').appendChild(profileImage);
    profileImage.src = user.piclink + "?" + new Date().getTime();
    profileImage.className = "img-responsive";

    // rendering aboutme
    const userAbout = document.getElementById('userAbout');
    userAbout.innerHTML = user.about;

    // rendering course and class
    const courseClass = document.getElementById('userCourseClass');
    const courseAndClass = 'Course ' + user.course + ', ' + user.year;
    courseClass.innerHTML = courseAndClass;

    // rednering living group
    const livingGroup = document.getElementById('userLivingGroup');
    livingGroup.innerHTML = 'Living Group: ' + user.residence;

    // PARTS NOT DONE: INTERESTS
}

// gets the times selected
function getSelectedTimes() {
    // check every checkbox dom object for whether it is checked
    let selectedTimes = [];
    for (let i=0; i<t.length; i++) {
        const checkBox = document.getElementById("check"+t[i]);
        if (checkBox.checked) {
            selectedTimes.push(t[i]);
        };
    }
    return selectedTimes;
}

// gets the top 3 halls in the ordered list object
function getTopThreeHalls() {
    // jQuery source: http://jsfiddle.net/LcBAQ/
    
    let topThreeHalls = [];
    for (let i=0; i<3; i++) {
        topThreeHalls.push($('#userDiningPreferences li:eq(' + i + ')').text());
    }

    console.log(topThreeHalls);
    return topThreeHalls
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
            if (match.hasOwnProperty('times')) {
                updateUsersWithMatch(user, match, theMatch);
                sendEmails(user, match);
            } else {
                const data = {
                    receiverEmail: user.email,
                    subjectText: "You don't have a match yet...",
                    bodyText: "Sadly, no one was available in the time and day you requested. But keep checking your matches page, and watch your inbox!"
                }
                post('/api/emailSender', { data }, function() {
                    alert("Email sent!");
                });
            }
        });
    });
}

function updateUsersWithMatch(user, yourMatch, theirMatch) {

    console.log("Your match, or lack thereof: ")
    console.log(yourMatch);

    const matchData = { // to be posted to the user
        data: {
            _id: user._id,
            matches: [yourMatch],
        }
    }

    // create a modified version of their Match
    const modTheirMatch = {
        userid: theirMatch.userid,
        date: theirMatch.date,
        times: yourMatch.times, // shares same times as match
        halls: yourMatch.halls, // shares same hall as match
    }

    const matchData2 = { // to be posted to the match
        data: {
            _id: yourMatch.userid,
            matches: [modTheirMatch],
        }
    }

    // update the user and match with the match
    post('/api/editProfile', matchData);
    post('/api/editProfile', matchData2);
}

// send emails
function sendEmails(user, match) {
    // send email to user
    const data = {
        receiverEmail: user.email,
        subjectText: "You have a match!",
        bodyText: "Check your matches page for your new match, and happy dining!"
    }
    post('/api/emailSender', { data }, function() {
        alert("Email sent!");
    });

    get('/api/user', { '_id': match.userid }, function (mUser) {
        const data = {
            receiverEmail: mUser.email,
            subjectText: "You have a match!",
            bodyText: "Check your matches page for your new match, and happy dining!"
        }
        post('/api/emailSender', { data }, function() {
            alert("Email sent to your match!");
        })
    });
}

main();