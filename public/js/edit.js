
function main() {

    const profileId = window.location.search.substring(1);
    get('/api/user', {'_id': profileId}, function(profileUser) {
        // all of these functions are now in submit.js

        renderUserText(profileUser);
        renderUserPicture(profileUser);
    });
    get('/api/whoami', {}, function(user){
        if (user._id === undefined){
            document.location.href = '/';
        }
        renderNavbar(user);
        //var data;
        $('#uploadForm').submit(function() {
        	//previewPic(user);

        	const data = {
        		_id: user._id,
        		piclink: 'https://s3.us-east-2.amazonaws.com/mealmate/'+user._id
        	}
        	post('/api/editProfile', { data }, function() {
                alert("Your photo has been uploaded!");
            });

        });

        $('#submitBtn').click(function() {
            //Source: https://stackoverflow.com/questions/20855482/preventing-html-and-script-injections-in-javascript
        	const data = {
        		_id: user._id,
        		course: $('#editUserCourse').val().replace(/</g, "&lt;").replace(/>/g, "&gt;"),
        		year: $('#editUserYear').val().replace(/</g, "&lt;").replace(/>/g, "&gt;"),
        		residence: $('#editUserLivingGroup').val().replace(/</g, "&lt;").replace(/>/g, "&gt;"),
                hkc: [$('#editHomeState').val().replace(/</g, "&lt;").replace(/>/g, "&gt;"), 
                    $('#editKerb').val().replace(/</g, "&lt;").replace(/>/g, "&gt;"), 
                    $('#editCell').val().replace(/</g, "&lt;").replace(/>/g, "&gt;")],
                favorites: [$('#editFavFood').val().replace(/</g, "&lt;").replace(/>/g, "&gt;"), 
                    $('#editFavDrink').val().replace(/</g, "&lt;").replace(/>/g, "&gt;"), 
                    $('#editFavMovie').val().replace(/</g, "&lt;").replace(/>/g, "&gt;"), 
                    $('#editFavMeal').val().replace(/</g, "&lt;").replace(/>/g, "&gt;"), 
                    $('#editFavCuisine').val().replace(/</g, "&lt;").replace(/>/g, "&gt;")],
                interests: $('#editUserInterests').val().replace(/</g, "&lt;").replace(/>/g, "&gt;")
                //interests: $('#interests-select').val()
        	}
        	post('/api/editProfile', { data }, () => alert("Your profile has been updated!"),
        	 () => console.log('error'));
            document.location.href = '/u/profile?'+user._id;

    	});

        //This is for enabling/ disabling the upload/cancel photo
        $('input:file').on("change", function() {
            $('input:submit').prop('disabled', !$(this).val());
            $('#cancel-photo').prop('disabled', !$(this).val());
        });

        //This button is for cancelling photo upload
        $('#cancel-photo').click(function(){
            renderUserPicture(user);
            $('input:file').val('');
            $('input:submit').prop('disabled', !$(this).val());
            $('#cancel-photo').prop('disabled', !$(this).val());
        });

        //This button is for going back to profile page
        $('#back-to-profile').click(function(){
            document.location.href = '/u/profile?'+user._id;
        });

    });
}

//Source: https://stackoverflow.com/questions/12368910/html-display-image-after-selecting-filename
function previewPic(user) {
	//get the file out of the upload widget
	const files = document.getElementById('photoupload').files;
	if (!files.length) {
	console.log('No image.');
	return alert('Please choose a file to upload first.');
	}
	const file = files[0];
	console.log(file);

    const reader = new FileReader();

    reader.onload = function (e) {
        $('#userImage')
            .attr('src', e.target.result)
    };

    reader.readAsDataURL(file);
    console.log(file);
    //post('/api/uploadImage', {data: {user, file}})

}

main();