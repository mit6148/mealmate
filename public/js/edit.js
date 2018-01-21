function main() {
    const profileId = window.location.search.substring(1);
    get('/api/user', {'_id': profileId}, function(profileUser) {
        // all of these functions are now in submit.js
        renderUserText(profileUser);
        renderUserPicture(profileUser);
    });
    get('/api/whoami', {}, function(user){
        renderNavbar(user);
        //var data;
        $('#addPhoto').click(function() {
        	//previewPic(user);
        	user.piclink='https://s3.us-east-2.amazonaws.com/mealmate/'+user._id;

        	const data = {
        		_id: user._id,
        		piclink: 'https://s3.us-east-2.amazonaws.com/mealmate/'+user._id
        	}
        	post('/api/editProfile', { data });

        });

        $('#submitBtn').click(function() {
        	const data = {
        		_id: user._id,
        		about: $('#editUserAbout').val(),
        		course: $('#editUserCourse').val(),
        		year: $('#editUserYear').val(),
        		residence: $('#editUserLivingGroup').val()
        	}
        	post('/api/editProfile', { data }, () => alert("Your profile has been updated!"),
        	 () => console.log('error'));

    	});


    });
}

//Source: https://stackoverflow.com/questions/12368910/html-display-image-after-selecting-filename
function previewPic(user) {
	//get the file out of the upload widget
	const files = document.getElementById('photoupload').files;
	if (!files.length) {
	console.log('no image');
	return alert('Please choose a file to upload first.');
	}
	const file = files[0];
	console.log(file);

    const reader = new FileReader();

    reader.onload = function (e) {
        $('#userImage')
            .attr('src', e.target.result)
            .width(150)
            .height(150);
    };

    reader.readAsDataURL(file);
    console.log(file);
    //post('/api/uploadImage', {data: {user, file}})

}
main();