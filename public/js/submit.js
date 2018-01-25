/* the equivalent of feed.js (catbook-workshop-4) for edit.js */
function renderUserText(user) {
    // rendering name
    const nameContainer = document.getElementById('userName');
    const nameHeader = document.createElement('h1');
    nameHeader.innerHTML = user.name;
    nameContainer.appendChild(nameHeader);

    // rendering default values in input elements
    $('#photokey').val(user._id);
    // $('#editUserAbout').val(user.about);
    $('#editUserCourse').val(user.course);
    $('#editUserYear').val(user.year);
    $('#editUserLivingGroup').val(user.residence);
    $('#editHomeState').val(user.hkc[0]);
    $('#editKerb').val(user.hkc[1]);
    $('#editCell').val(user.hkc[2]);
    $('#editFavFood').val(user.favorites[0]);
    $('#editFavDrink').val(user.favorites[1]);
    $('#editFavMovie').val(user.favorites[2]);
    $('#editFavMeal').val(user.favorites[3]);
    $('#editFavCuisine').val(user.favorites[4]);
    $('#interests-select').val(user.interests.split(',')).trigger('chosen:updated');

}

function renderUserPicture(user){
    // rendering profile image
    //$('#userImage').attr('src', '');
    console.log('hello redner user');

    var picSrc = user.piclink;
    if (picSrc.includes("amazonaws")){
        picSrc = picSrc + "?" + new Date().getTime();
    }
    $('#userImage').attr('src', picSrc);
    $('#userImage').width('200px').height('auto');
}
