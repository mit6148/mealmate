/* the equivalent of feed.js (catbook-workshop-4) for edit.js */
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

    // render course and class inputs
    renderCourseClassInput(user);

    // rendering aboutme
    const userAbout = document.getElementById('userAbout');
    userAbout.innerHTML = user.about;

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
    // currently nearly identical to profile.js, but with a matches button
}

// edit course and class
function renderCourseClassInput(user) {

    const course = document.getElementById('editUserCourse');
    const year = document.getElementById('editUserClass');

    const newCourse = document.createElement('input');
    newCourse.setAttribute('type', 'text');
    newCourse.setAttribute('placeholder', user.course);
    newCourse.setAttribute('id', 'new-course-input');

    const newClass = document.createElement('input');
    newClass.setAttribute('type', 'text');
    newClass.setAttribute('placeholder', user.year);
    newClass.setAttribute('id', 'new-class-input');

    course.appendChild(newCourse);
    year.appendChild(newClass);

}

/* ------------------ SUBMISSION LINK CODE BELOW!!!!! ------------------ */

// render the correct submission link
// currently just a "return to profile page link"
function submitProfileLink(user) {
    const submitLinkDiv = document.getElementById('submitProfileImage');
    const submitLink = document.createElement('a');
    submitLink.setAttribute('href', '/u/profile?'+user._id);
    submitLink.innerHTML = 'Submit New Profile Picture';
    submitLinkDiv.appendChild(submitLink);
}

function submitCourseClassLink(user) {
    const submitLinkDiv = document.getElementById('userCourseClass');
    const submitLink = document.createElement('button');
    submitLink.className = 'btn btn-outline-primary';
    submitLink.innerHTML = 'Submit New Course and Class Year';
    submitLink.addEventListener('click', function callbackPasser() {
    	submitCourseClassHandler(user);
    }); // we need to pass a parameter to submitCourseClassHandler
    submitLinkDiv.appendChild(submitLink);
}

/* -------------------- SUBMISSION HANDLERS BELOW!!!!! ------------------- */

function submitCourseClassHandler (user) {

	const newCourse = document.getElementById('editUserCourse');
	const newClass = document.getElementById('editUserClass');

	const data = { // set everything to current value if nothing inputted
		dataType: "course-year",
		course: user.course,
		year: user.year,
	};

	if (newCourse) {
		data.course = newCourse;
	}

	if (newClass) {
		data.year = newClass;
	}

	put('/api/editProfile/'+user._id, data);
	newCourse.value = '';
	newClass.value = '';

}