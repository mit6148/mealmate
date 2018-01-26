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

function renderNavbar(user){
	const navbarDiv = document.getElementById('myNavbar');
	const navbarObjects = document.createElement('ul');
	navbarObjects.className = "nav navbar-nav navbar-right";

	const currentPath = window.location.pathname; // get the current page
    const aboutHeader = newNavbarItem('ABOUT', '/about', currentPath); 
    const matchesHeader = newNavbarItem('MATCHES', '/u/matches?'+user._id, currentPath); 
	
	navbarObjects.appendChild(newNavbarItem('HOME', '/', currentPath));
    navbarObjects.appendChild(newNavbarItem('ABOUT', '/about', currentPath));
    
	if (user._id !== undefined) {
		navbarObjects.appendChild(newNavbarItem('PROFILE', '/u/profile?'+user._id, currentPath, user)); 
        navbarObjects.appendChild(newNavbarItem('FIND', '/u/findMealmate?'+user._id, currentPath, user));
        navbarObjects.appendChild(newNavbarItem('MATCHES', '/u/matches?'+user._id, currentPath, user));
		navbarObjects.appendChild(newNavbarItem('LOGOUT', '/logout', currentPath, user));
	} else {
		navbarObjects.appendChild(newNavbarItem('LOGIN', 'auth/facebook', currentPath, undefined)); // add this when FB authentication happens
	}
	
	navbarDiv.appendChild(navbarObjects);
	
}