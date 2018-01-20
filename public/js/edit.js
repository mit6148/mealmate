function main() {
    const profileId = window.location.search.substring(1);
    get('/api/user', {'_id': profileId}, function(profileUser) {
        // all of these functions are now in submit.js
        renderUserData(profileUser);
    });
    get('/api/whoami', {}, function(user){
        renderNavbar(user);
    });     
}

function renderUserData(user) {
	// rendering about
	$('#editUserAbout').val(user.about);
	$('#editUserCourse').val(user.course);
	$('#editUserYear').val(user.year);
	$('editUserLivingGroup').val(user.residence);

// User interests not currently implemented	
//	$('editUserInterests').val(user.interests);


}

main();