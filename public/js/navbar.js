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
	if (user._id === 'anonid') {
		// navbarDiv.appendChild(newNavbarItem('Login', 'auth/facebook')); // add this when FB authentication happens
	} else {
		navbarDiv.appendChild(newNavbarItem('Profile', '/u/profile?'+user._id));
		navbarDiv.appendChild(newNavbarItem('Matches', '/u/matches?'+user._id));
		navbarDiv.appendChild(newNavbarItem('Logout', '/logout'));
	}
	
}