function main() {
    const profileId = window.location.search.substring(1);
    get('/api/user', {'_id': profileId}, function(profileUser) {
        // all of these functions are now in submit.js
        renderUserData(profileUser);
    });
    get('/api/whoami', {}, function(user){
        renderNavbar(user);
        var data;
        $('#submitBtn').click(function() {
	    	if ($('#editUserAbout').val() !== user.about){
	    		data = {
					_id: user._id,
					dataType: "about",
					about: $('#editUserAbout').val()
				}

				post('/api/editProfile', data);	
	    	}

	    	if ($('#editUserCourse').val() !== user.course){
	    		data = {
					_id: user._id,
					dataType: "course",
					course: $('#editUserCourse').val()
				}

				post('/api/editProfile', data);
	    	}

	    	if ($('#editUserYear').val() !== user.year){
	    		data = {
					_id: user._id,
					dataType: "year",
					year: $('#editUserYear').val()
				}

				post('/api/editProfile', data);
	    	}

	    	if ($('#editUserLivingGroup').val() !== user.residence){
	    		data = {
					_id: user._id,
					dataType: "residence",
					residence: $('#editUserLivingGroup').val()
				}

				post('/api/editProfile', data);
	    	}

	    	alert("Your profile has been updated!");
    	});


    });
}

main();