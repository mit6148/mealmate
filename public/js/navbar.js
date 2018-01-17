function newNavbarItem(text, url) {
	const itemLink = document.createElement('a');
	itemLink.className = 'nav-item nav-link';
	itemLink.innerHTML = text;
	itemLink.href = url;

	return itemLink;
}

function renderNavbar(user){
	const navbarDiv = document.getElementById('nav-item-container');

	navbarDiv.appendChild(newNavbarItem('Home', '/'));
	if (user._id !== undefined) {
		navbarDiv.appendChild(newNavbarItem('Profile', '/u/profile?'+user._id)); // the real one. How to get it to work?
		navbarDiv.appendChild(newNavbarItem('Matches', '/u/matches?'+user._id));
		//navbarDiv.appendChild(newNavbarItem('Profile', '/profile'));
		//navbarDiv.appendChild(newNavbarItem('Matches', '/matches'));
		navbarDiv.appendChild(newNavbarItem('Logout', '/logout'));
	} else {
		navbarDiv.appendChild(newNavbarItem('Login', 'auth/facebook')); // add this when FB authentication happens
	}
	
}