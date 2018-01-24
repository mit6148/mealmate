
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
        renderNavbar(user);
    });

}

function loadPage(user){
    renderUserData(user);

    // render the correct edit link
    const editButton = document.getElementById('editProfile');
    editButton.addEventListener('click', function() {
        document.location.href = '/u/edit?'+user._id;
    });
}

function renderUserData(user) {
    // rendering name
    const nameContainer = document.getElementById('userName');
    const nameHeader = document.createElement('h1');
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
    profileImage.className = "img-responsive";

    // rendering aboutme
    const userAbout = document.getElementById('userAbout');
    userAbout.innerHTML = user.about;

    // rendering course and class
    const courseClass = document.getElementById('userCourseClass');
    const courseAndClass = 'Course ' + user.course + ', ' + user.year;
    courseClass.innerHTML = courseAndClass;

    // rednering living group
    const livingGroup = document.getElementById('userLivingGroup');
    livingGroup.innerHTML = 'Living Group: ' + user.residence;

    // PARTS NOT DONE: INTERESTS
}

main();