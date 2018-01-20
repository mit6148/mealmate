/* the equivalent of feed.js (catbook-workshop-4) for edit.js */
function renderUserData(user) {
    // rendering name
    const nameContainer = document.getElementById('userName');
    const nameHeader = document.createElement('h1');
    nameHeader.innerHTML = user.name;
    nameContainer.appendChild(nameHeader);

    // rendering profile image
    const profileImage = document.createElement('img');
    document.getElementById('userImage').appendChild(profileImage);
    profileImage.src = 'https://graph.facebook.com/'+user.fbid+'/picture?type=large';
    submitProfileLink(user); // submission link


    // rendering default values in input elements
    $('#editUserAbout').val(user.about);
    $('#editUserCourse').val(user.course);
    $('#editUserYear').val(user.year);
    $('#editUserLivingGroup').val(user.residence);

    // User interests not currently implemented 
//  $('editUserInterests').val(user.interests);

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
    	submitCourseClassHandler(user); // submit the new info
    	document.location.href = '/u/profile?'+user._id // return to the profile page
    }); // we need to pass a parameter to submitCourseClassHandler
    submitLinkDiv.appendChild(submitLink);
}

function submitAboutLink(user) {
	const submitLinkDiv = document.getElementById('userAbout');
    const submitLink = document.createElement('button');
    submitLink.innerHTML = 'Submit About Me';
    submitLink.addEventListener('click', function callbackPasser() {
    	submitAboutHandler(user); // submit the new info
    	document.location.href = '/u/profile?'+user._id // return to the profile page
    }); // we need to pass a parameter to submitCourseClassHandler
    submitLinkDiv.appendChild(submitLink);
}

function submitResidenceLink(user) {
	const submitLinkDiv = document.getElementById('userLivingGroup');
    const submitLink = document.createElement('button');
    submitLink.innerHTML = 'Submit Living Group';
    submitLink.addEventListener('click', function callbackPasser() {
    	submitResHandler(user); // submit the new info
    	document.location.href = '/u/profile?'+user._id // return to the profile page
    }); // we need to pass a parameter to submitCourseClassHandler
    submitLinkDiv.appendChild(submitLink);
}

/* -------------------- SUBMISSION HANDLERS BELOW!!!!! ------------------- */

// submit course and class
function submitCourseClassHandler (user) {

	const newCourse = document.getElementById('new-course-input');
	const newClass = document.getElementById('new-class-input');

	const data = { // set everything to current value if nothing inputted
		_id: user._id,
		dataType: "course-year",
		course: user.course,
		year: user.year,
	};

	if (newCourse.value)
		data.course = newCourse.value;

	if (newClass.value)
		data.year = newClass.value;

	post('/api/editProfile', data); // endpoint, params, no successCallBack or failureCallBack
	newCourse.value = '';
	newClass.value = '';
}

// submit about me
function submitAboutHandler (user) {
	const newAbout = document.getElementById('new-about-input');
	const data = {
		_id: user._id,
		dataType: "about",
		about: newAbout.value
	}

	post('/api/editProfile', data);
	newAbout.value = '';
}

// submit dining
function submitResHandler (user) {
	const newRes = document.getElementById('new-res-input');
	const data = {
		_id: user._id,
		dataType: "residence",
		residence: newRes.value
	}

	post('/api/editProfile', data);
	newRes.value = '';
}