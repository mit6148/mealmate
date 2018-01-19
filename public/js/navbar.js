function newNavbarItem(text, url, currentPath) {
	const itemBox = document.createElement('li');
	const itemLink = document.createElement('a');
	// itemLink.className = 'nav-item nav-link';
	itemLink.innerHTML = text;
	itemLink.href = url;
	if (url == currentPath) {
		itemLink.className = "active";
	}
	itemBox.appendChild(itemLink);

	return itemBox;
}

function renderNavbar(user){
	const navbarDiv = document.getElementById('myNavbar');
	const navbarObjects = document.createElement('ul');
	navbarObjects.className = "nav navbar-nav navbar-right";

	const currentPath = window.location.pathname; // get the current page
	
	navbarObjects.appendChild(newNavbarItem('Home', '/', currentPath));
	if (user._id !== undefined) {
		navbarObjects.appendChild(newNavbarItem('Profile', '/u/profile?'+user._id, currentPath)); // the real one. How to get it to work?
		navbarObjects.appendChild(newNavbarItem('Matches', '/u/matches?'+user._id, currentPath));
		//navbarDiv.appendChild(newNavbarItem('Profile', '/profile'));
		//navbarDiv.appendChild(newNavbarItem('Matches', '/matches'));
		navbarObjects.appendChild(newNavbarItem('Logout', '/logout', currentPath));
	} else {
		navbarObjects.appendChild(newNavbarItem('Login', 'auth/facebook', currentPath)); // add this when FB authentication happens
	}
	
	navbarDiv.appendChild(navbarObjects);
	
}