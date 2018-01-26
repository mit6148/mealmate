function newNavbarItem(text, url, currentPath, user) {
	const itemBox = document.createElement('li');
	const itemLink = document.createElement('a');
	itemLink.innerHTML = text;
	itemLink.href = url;
    console.log("url: " + url);
    console.log("currentPath: " + currentPath);
	if (url == currentPath) {
		itemLink.className = "active";
	}
    if (user != undefined) {
        if (url == (currentPath + "?" + user._id)) {
            itemLink.className = "active";
        }
    }
	itemBox.appendChild(itemLink);

	return itemBox;
}
/*
function newDropdown(text, links, linkLabels, currentPath, user){
	const dropdownBox = document.createElement('div');
	dropdownBox.className = "dropdown";

	const dropdownBtn = document.createElement('button');
	dropdownBox.appendChild(dropdownBtn);
	dropdownBtn.className = "dropbtn";
	dropdownBtn.innerHTML =  text;
    text.className = "dropdown-text";
	dropdownBtn.addEventListener('click', function(){
		document.location.href = links[0];
	})

	const dropdowncontent = document.createElement('div');
	dropdownBox.appendChild(dropdowncontent);
	dropdowncontent.className = "dropdown-content";

	for (let i = 0; i < links.length; i++){
		//dropdowncontent.appendChild(newNavbarItem(linkLabels[i], links[i], currentPath));
		const dropdownLink = document.createElement('a');
        dropdownLink.className = "dropdown-link";
		dropdowncontent.appendChild(dropdownLink);
		dropdownLink.href = links[i];
		dropdownLink.innerHTML = linkLabels[i];
		dropdownLink.addEventListener("click", function(){
			document.location.href = links[i];
		});
		/*
		if (links[i] === currentPath){
			dropdownLink.className = "active";
		}
		
	}
	console.log(dropdowncontent);

	return dropdownBox;

}
*/

function renderNavbar(user){
	const navbarDiv = document.getElementById('myNavbar');
	const navbarObjects = document.createElement('ul');
	navbarObjects.className = "nav navbar-nav navbar-right";

	const currentPath = window.location.pathname; // get the current page
	
	navbarObjects.appendChild(newNavbarItem('HOME', '/', currentPath));
    navbarObjects.appendChild(newNavbarItem('ABOUT', '/about', currentPath));
    
	if (user._id !== undefined) {
		navbarObjects.appendChild(newNavbarItem('PROFILE', '/u/profile?'+user._id, currentPath, user)); 
        navbarObjects.appendChild(newNavbarItem('FIND', '/u/findMealmate?'+user._id, currentPath, user));
        navbarObjects.appendChild(newNavbarItem('MATCHES', '/u/matches?'+user._id, currentPath, user));
		navbarObjects.appendChild(newNavbarItem('LOGOUT', '/logout', currentPath, user));
		//navbarObjects.innerHTML = '<div class="dropdown"> <button class="dropbtn">Dropdown <i class="fa fa-caret-down"></i> </button> <div class="dropdown-content">  <a href="#">Link 1</a>  <a href="#">Link 2</a> <a href="#">Link 3</a> </div </div> ';
		/*navbarObjects.appendChild(newDropdown('PROFILE', ['/u/profile?'+user._id, '/u/edit?'+user._id], ['VIEW', 'EDIT'], currentPath, user));
        navbarObjects.appendChild(newDropdown('MATCHES', ['/u/matches?'+user._id, '/u/findMealmate?'+user._id], ['CURRENT', 'FIND'], currentPath, user));
		navbarObjects.appendChild(newNavbarItem('LOGOUT', '/logout', currentPath, user));*/
	} else {
		navbarObjects.appendChild(newNavbarItem('LOGIN', 'auth/facebook', currentPath)); // add this when FB authentication happens
	}
	
	navbarDiv.appendChild(navbarObjects);
	
}