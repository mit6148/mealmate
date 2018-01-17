function main() {
    // const profileId = window.location.search.substring(1);
    /* get('/api/user', {'_id': profileId}, function(profileUser) {
        renderUserData(profileUser);
    }); */
    const user = {
        _id: 'anonid',
        name: 'Anonymous',
        course: '0',
        year: '2000',
        residence: 'Maseeh',
        times: { 01012016: 0 }, // date: time dictionary (times are the indices of boxes you checked off)
        halls: ['Next', 'Maseeh'], // in order of preference
        about: "Hi I'm anonymous",
    };
    renderNavbar(user);
    renderUserData(user);
}

function renderUserData(user) {
    // rendering name
    const nameContainer = document.getElementById('userName');
    const nameHeader = document.createElement('h1');
    nameHeader.innerHTML = user.name;
    nameContainer.appendChild(nameHeader);

    // rendering profile image
    const profileImage = document.getElementById('userImage');
    profileImage.style = 'background-image:url(https://coubsecure-s.akamaihd.net/get/b69/p/coub/simple/cw_timeline_pic/3171e07ffd1/647c464aad3a26608293d/med_1487878540_image.jpg';
    // idk how to resize

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
    for (let i=0; i<user.halls.length; i++) {
        const hallItem = document.createElement('li');
        hallItem.innerHTML = user.halls[i];
        hallPrefs.appendChild(hallItem);
    }

    // PARTS NOT DONE: INTERESTS, MAKING ALL OF THIS EDITABLE, TIME/DATE
}

main();