/* the equivalent of feed.js (catbook-workshop-4) for edit.js */
function renderUserText(user) {
    // rendering name
    const nameContainer = document.getElementById('userName');
    const nameHeader = document.createElement('h1');
    nameHeader.innerHTML = user.name;
    nameContainer.appendChild(nameHeader);

    // rendering default values in input elements
    $('#photokey').val(user._id);
    $('#editUserCourse').val(user.course.replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
    $('#editUserYear').val(user.year.replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
    $('#editUserLivingGroup').val(user.residence.replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
    $('#editHomeState').val(user.hkc[0].replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
    $('#editKerb').val(user.hkc[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
    $('#editCell').val(user.hkc[2].replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
    $('#editFavFood').val(user.favorites[0].replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
    $('#editFavDrink').val(user.favorites[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
    $('#editFavMovie').val(user.favorites[2].replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
    $('#editFavMeal').val(user.favorites[3].replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
    $('#editFavCuisine').val(user.favorites[4].replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
    $('#editUserInterests').val(user.interests.replace(/&lt;/g, '<').replace(/&gt;/g, '>'));

}

function renderUserPicture(user){
    // rendering profile image

    var picSrc = user.piclink;
    if (picSrc.includes("amazonaws")){
        picSrc = picSrc + "?" + new Date().getTime();
    }
    $('#userImage').attr('src', picSrc);
    $('#userImage').width('200px').height('auto');
}
