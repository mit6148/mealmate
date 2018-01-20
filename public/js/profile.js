function main() {
    const profileId = window.location.search.substring(1);
    get('/api/user', {'_id': profileId}, function(profileUser) {
        renderUserData(profileUser);

        // Find buddy event listener
        /*
        const matchButton = document.getElementById('findBuddyButton');
        matchButton.addEventListener('click', function() {
            const match = getMatch(profileUser);
            // post match to the user
            document.location.href = '/u/matches?'+profileUser._id; // does this work lol
        });
        */

        // render the correct edit link
        const editLinkDiv = document.getElementById('editProfile');
        const editLink = document.createElement('a');
        editLink.setAttribute('href', '/u/edit?'+profileUser._id);
        editLink.innerHTML = 'Edit Profile';
        editLinkDiv.appendChild(editLink);

// HACKY: needed to put this inside get request since took time for jquery to load
        $('#datepicker').datepicker();
        $('#findBuddyButton').click(function(){
            console.log($('#datepicker').datepicker('getDate')); //ex output String: Thu Jan 18 2018 00:00:00 GMT-0500 (EST)
        });
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
    console.log(nameContainer);
    console.log(nameHeader);
    nameContainer.appendChild(nameHeader);

    // rendering profile image
    const profileImage = document.createElement('img');
    document.getElementById('userImage').appendChild(profileImage);
//    profileImage.src = 'https://graph.facebook.com/2015862172072286/picture?type=large'
    profileImage.src = 'https://graph.facebook.com/'+user.fbid+'/picture?type=large';

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

function getMatch(user) {
    console.log("Hi fam");
    return undefined;
}

main();