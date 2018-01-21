function main() {
    const profileId = window.location.search.substring(1);
    get('/api/user', {'_id': profileId}, function(profileUser) {
        // all of these functions are now in submit.js
        renderUserText(profileUser);
        renderUserPicture(profileUser);
    });
    get('/api/whoami', {}, function(user){
        renderNavbar(user);
        var data;
        $('#addPhoto').click(function() {
        	console.log('boop');
        	
        	user.piclink='https://s3.us-east-2.amazonaws.com/mealmate/'+user._id;
        	addPhoto(user, function() {
        		console.log('jdd');
        		renderUserPicture(user);
        	});
        	data = {
        		_id: user._id,
        		dataType: "piclink",
        		piclink: 'https://s3.us-east-2.amazonaws.com/mealmate/'+user._id
        	}
        	post('/api/editProfile', data);

        });

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