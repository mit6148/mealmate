const t = ['9','9.5','10','10.5','11','11.5','12','12.5','13','13.5','14','14.5',
           '17','17.5','18','18.5','19','19.5','20','20.5'];

function main() {
    const profileId = window.location.search.substring(1);
    $('#datepicker').datepicker({
        autoclose: true,
        todayHighlight: true
    }).datepicker('update', new Date()); // nice jQuery

    get('/api/user', {'_id': profileId}, function(profileUser) {
        // renderUserData(profileUser);

        const matchButton = document.getElementById('find-mealmate-button');
        matchButton.addEventListener('click', function() {
            const date = $('#datepicker').datepicker('getDate'); //ex output String: Thu Jan 18 2018 00:00:00 GMT-0500 (EST)
            const selectedTimes = getSelectedTimes();
            const topThreeHalls = getTopThreeHalls();
            getMatch(profileUser, date, selectedTimes, topThreeHalls);
            // document.location.href = '/u/matches?'+profileUser._id; // does this work lol
        });

        // render the correct edit link
        const editLinkDiv = document.getElementById('editProfile');
        const editLink = document.createElement('a');
        editLink.setAttribute('href', '/u/edit?'+profileUser._id);
        editLink.innerHTML = 'Edit Profile';
        editLinkDiv.appendChild(editLink);

        if (profileUser.email === ""){
            $('#emailModal').show();
            $('#submitEmail').click(function(){
                const data={
                    _id: profileUser._id,
                    email: $('#userEmail').val()
                }
                post('/api/editProfile', { data }, function(){
                    loadPage(profileUser);
                    $('#emailModal').hide();
                });
            });

        }else{
            loadPage(profileUser);
        }
    });

    get('/api/whoami', {}, function(user){
        renderNavbar(user);
    });


    $('#tester').click(function(){
        $('#emailModal').show();
    });
}

function loadPage(user){
    renderUserData(user);

    const matchButton = document.getElementById('find-mealmate-button');
    matchButton.addEventListener('click', function() {
        const date = $('#datepicker').datepicker('getDate'); //ex output String: Thu Jan 18 2018 00:00:00 GMT-0500 (EST)
        const selectedTimes = getSelectedTimes();
        getMatch(user, date, selectedTimes);
        // document.location.href = '/u/matches?'+user._id; // does this work lol
    });

    // render the correct edit link
    const editLinkDiv = document.getElementById('editProfile');
    const editLink = document.createElement('a');
    editLink.setAttribute('href', '/u/edit?'+user._id);
    editLink.innerHTML = 'Edit Profile';
    editLinkDiv.appendChild(editLink);
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
    profileImage.style.width='200px';
    profileImage.style.height='auto';

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
    // jQuery
    // source: http://jsfiddle.net/LcBAQ/
    
    let topThreeHalls = [];
    for (let i=0; i<3; i++) {
        topThreeHalls.push($('#userDiningPreferences li:eq(' + i + ')').text());
    }

    console.log(topThreeHalls);
    return topThreeHalls
}

function getMatch(user, d, ts, h) {
    // currently hardcoded date, halls, and times
    // halls are just the user's top 3

    const data = {
        userid: user._id,
        date: d,
        times: ts,
        halls: h
    };

    // console.log(data);
    // console.log(JSON.stringify(data))

    // first post your request to the database
    // then get a match
    post('/api/matchPost', data, function (theMatch) { // return the posted match
        console.log("Your posted match request");
        console.log(theMatch);
        get('/api/matchRequest', {'userid': user._id, 'date': d, 'times': ts, 'halls': h}, function (match) {
            if (match.hasOwnProperty('times')) {
                console.log("Your match, or lack thereof: ")
                console.log(match);
                const matchData = { // to be posted to the user
                    _id: user._id,
                    dataType: "matches",
                    m: match
                }

                console.log("the match you got. Their userid:");
                console.log(match.userid);
                console.log("Your user _id");
                console.log(user._id);

                const matchData2 = { // to be posted to the match
                    _id: match.userid,
                    dataType: "matches",
                    m: theMatch
                }

                // update the user and match with the match
                post('/api/editProfile', matchData);
                post('/api/editProfile', matchData2);
            }
        });
    });
}

main();