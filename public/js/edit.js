
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
        	//user.piclink='https://s3.us-east-2.amazonaws.com/mealmate/'+user._id;

        	const data = {
        		_id: user._id,
        		piclink: 'https://s3.us-east-2.amazonaws.com/mealmate/'+user._id
        	}
        	post('/api/editProfile', { data }, function() {
                alert("Your photo has been uploaded!");
            });

        });

        $('#submitBtn').click(function() {
        	const data = {
        		_id: user._id,
        		course: $('#editUserCourse').val(),
        		year: $('#editUserYear').val(),
        		residence: $('#editUserLivingGroup').val(),
                hkc: [$('#editHomeState').val(), $('#editKerb').val(), $('#editCell').val()],
                favorites: [$('#editFavFood').val(), $('#editFavDrink').val(), $('#editFavMovie').val(), $('#editFavMeal').val(), $('#editFavCuisine').val()],
                interests: $('#interests-select').val()
        	}
        	post('/api/editProfile', { data }, () => alert("Your profile has been updated!"),
        	 () => console.log('error'));

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
        $('#cancel').click(function(){
            document.location.href = '/u/profile?'+user._id;
        });

        $("#interests-select").chosen({
            width:"95%",
            max_selected_options: 3
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