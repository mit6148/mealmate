
function main() {
    const profileId = window.location.search.substring(1);
    $('#datepicker').datepicker({
        autoclose: true,
        todayHighlight: true
    }).datepicker('update', new Date()); // nice jQuery

    get('/api/user', {'_id': profileId}, function(profileUser) {

        if (!(profileUser.email) || profileUser.email === ""){
            $('#emailModal').show();
            $('#submitEmail').click(function(){
                if ($('#userEmail').val().indexOf('@') > -1){
                    const data={
                        _id: profileUser._id,
                        email: $('#userEmail').val()
                    }
                    post('/api/editProfile', { data }, function(){
                        loadPage(profileUser);
                        $('#emailModal').hide();
                    });
                }else{
                    alert("Please enter a valid email!");
                }
            });

        } else{
            loadPage(profileUser);
        }
    });
    get('/api/whoami', {}, function(user){
        if (user._id === undefined){
            document.location.href = '/';
        } else if (user._id != profileId) {
            // you're viewing someone else's profile
            const editButton = document.getElementById('editProfile');
            editButton.style.visibility = "none";
        } else {
            loadEditButton(user);
        }
        renderNavbar(user);
    });

}

function loadPage(user){
    renderUserData(user);
    renderUserFavs(user);
}

// only load the edit button if the current user owns the profile
function loadEditButton(user) {
    // render the correct edit link
    const editButton = document.getElementById('editProfile');
    editButton.addEventListener('click', function() {
        document.location.href = '/u/edit?'+user._id;
    });
}

// render the GENERAL section of ABOUT
function renderUserData(user) {
    // rendering name
    const nameContainer = document.getElementById('userName');
    const nameHeader = document.createElement('h2');
    nameHeader.innerHTML = user.name;
    nameContainer.appendChild(nameHeader);

    // rendering profile image
    const profileImage = document.createElement('img');
    document.getElementById('userImage').appendChild(profileImage);
    var picSrc = user.piclink;
    if (picSrc.includes("amazonaws")){
        picSrc = picSrc + "?" + new Date().getTime();
    }
    profileImage.src = picSrc;
    profileImage.className = "img-responsive center-block profile-image";

    /* // rendering aboutme
    const userAbout = document.getElementById('userAbout');
    userAbout.innerHTML = user.about; */

    // rendering course and class
    const course = document.getElementById('userCourse');
    course.innerHTML = user.course;
    const year = document.getElementById('userClass');
    year.innerHTML = user.year;

    // rednering living group
    const livingGroup = document.getElementById('userLivingGroup');
    livingGroup.innerHTML = user.residence;

    // home state, kerberos, cell phone
    const homeState = document.getElementById('userHomeState');
    const kerb = document.getElementById('userKerb');
    const cell = document.getElementById('userCell');
    homeState.innerHTML = user.hkc[0];
    kerb.innerHTML = user.hkc[1];
    cell.innerHTML = user.hkc[2];
}

// render the GET TO KNOW ME section of ABOUT
function renderUserFavs(user) {

    generateFavBlock('FAVORITE FOOD', 'favfood', user.favorites[0]);
    generateFavBlock('FAVORITE DRINK', 'favdrink', user.favorites[1]);
    generateFavBlock('FAVORITE MOVIE', 'favmovie', user.favorites[2]);
    generateFavBlock('FAVORITE MEAL OF THE DAY', 'favmeal', user.favorites[3]);
    generateFavBlock('FAVORITE CUISINE', 'favcuisine', user.favorites[4]);
    generateFavBlock('INTERESTS', 'interests', user.interests);

}

function generateFavBlock(favLabel, favId, favContent){
    if (favContent.replace(/\s/g, '').length){
        $('#getToKnowMeHeader').show();
        const headerWrap = document.createElement('h4');
        $('#favDiv').append(headerWrap);

        const labelSpan = document.createElement('span');
        headerWrap.appendChild(labelSpan);
        labelSpan.style.fontWeight = 'bold';
        labelSpan.innerHTML = favLabel + ': ';

        const contentSpan = document.createElement('span');
        headerWrap.appendChild(contentSpan);
        contentSpan.id = favId;
        contentSpan.innerHTML = favContent;
    }

}

main();