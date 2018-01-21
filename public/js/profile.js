const t = ['9','9.5','10','10.5','11','11.5','12','12.5','13','13.5','14','14.5',
           '17','17.5','18','18.5','19','19.5','20','20.5'];

function main() {
    const profileId = window.location.search.substring(1);
    $('#datepicker').datepicker({
        autoclose: true,
        todayHighlight: true
    }).datepicker('update', new Date()); // nice jQuery

    get('/api/user', {'_id': profileId}, function(profileUser) {
        renderUserData(profileUser);

        const matchButton = document.getElementById('find-mealmate-button');
        matchButton.addEventListener('click', function() {
            const date = $('#datepicker').datepicker('getDate'); //ex output String: Thu Jan 18 2018 00:00:00 GMT-0500 (EST)
            const selectedTimes = getSelectedTimes();
            getMatch(profileUser, date, selectedTimes);
            // document.location.href = '/u/matches?'+profileUser._id; // does this work lol
        });

        // render the correct edit link
        const editLinkDiv = document.getElementById('editProfile');
        const editLink = document.createElement('a');
        editLink.setAttribute('href', '/u/edit?'+profileUser._id);
        editLink.innerHTML = 'Edit Profile';
        editLinkDiv.appendChild(editLink);

    });
    get('/api/whoami', {}, function(user){
        renderNavbar(user);
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
    profileImage.src = user.piclink;

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

    // rendering dining preferences
    const hallPrefs = document.getElementById('userDiningPreferences');
    if (user.halls) {
        // print the hall choices if they exist
        for (let i=0; i<user.halls.length; i++) {
            const hallItem = document.createElement('li');
            hallItem.innerHTML = user.halls[i];
            hallPrefs.appendChild(hallItem);
        }
    } else {
        const hallItem = document.createElement('li');
        hallItem.innerHTML = 'No preferences listed';
        hallPrefs.appendChild(hallItem);
    } 
    // PARTS NOT DONE: INTERESTS, MAKING ALL OF THIS EDITABLE, TIME/DATE
}

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

function getMatch(user, d, ts) {
    // currently hardcoded date, halls, and times
    // halls are just the user's top 3

    const h = ["Next", "Maseeh", "Baker"];
    const data = {
        date: d,
        times: ts,
        halls: h
    };

    // console.log(data);
    // console.log(JSON.stringify(data))

    // first post your request to the database
    // then get a match
    post('/api/matchPost', data, function () {
        get('/api/matchRequest', {'userid': user._id, 'date': d, 'times': ts, 'halls': h}, function (match) {
            const matchData = {
                _id: user._id,
                dataType: "matches",
                m: match
            }
            // update the user with the match
            post('/api/editProfile', matchData);
            console.log("Your match, or lack thereof: " + match);
        });
    });
}

main();