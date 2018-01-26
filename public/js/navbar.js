function newNavbarItem(text, url, currentPath) {
	const itemBox = document.createElement('li');
	const itemLink = document.createElement('a');
	itemLink.innerHTML = text;
	itemLink.href = url;
	if (url == currentPath) {
		itemLink.className = "active";
	}
	itemBox.appendChild(itemLink);

	return itemBox;
}

function newDropdown(text, links, linkLabels, currentPath){
	const dropdownBox = document.createElement('div');
	dropdownBox.className = "dropdown";

	const dropdownBtn = document.createElement('button');
	dropdownBox.appendChild(dropdownBtn);
	dropdownBtn.className = "dropbtn";
	dropdownBtn.innerHTML =  text + "<i class='fa fa-caret-down'></i>";
	dropdownBtn.addEventListener('click', function(){
		document.location.href = links[0];
	})

	const dropdowncontent = document.createElement('div');
	dropdownBox.appendChild(dropdowncontent);
	dropdowncontent.className = "dropdown-content";

	for (let i = 0; i < links.length; i++){
		//dropdowncontent.appendChild(newNavbarItem(linkLabels[i], links[i], currentPath));
		const dropdownLink = document.createElement('a');
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
		*/
	}
	console.log(dropdowncontent);

	return dropdownBox;

}

function renderNavbar(user){
	const navbarDiv = document.getElementById('myNavbar');
	const navbarObjects = document.createElement('ul');
	navbarObjects.className = "nav navbar-nav navbar-right";

	const currentPath = window.location.pathname; // get the current page
	
	navbarObjects.appendChild(newNavbarItem('HOME', '/', currentPath));
    navbarObjects.appendChild(newNavbarItem('ABOUT', '/about', currentPath));
    
	if (user._id !== undefined) {
		//navbarObjects.innerHTML = '<div class="dropdown"> <button class="dropbtn">Dropdown <i class="fa fa-caret-down"></i> </button> <div class="dropdown-content">  <a href="#">Link 1</a>  <a href="#">Link 2</a> <a href="#">Link 3</a> </div </div> ';
		navbarObjects.appendChild(newDropdown('PROFILE', ['/u/profile?'+user._id, '/u/edit?'+user._id], ['VIEW', 'EDIT'], currentPath));
        navbarObjects.appendChild(newDropdown('MATCHES', ['/u/matches?'+user._id, '/u/findMealmate?'+user._id], ['CURRENT', 'FIND'], currentPath));
		navbarObjects.appendChild(newNavbarItem('LOGOUT', '/logout', currentPath));
	} else {
		navbarObjects.appendChild(newNavbarItem('LOGIN', 'auth/facebook', currentPath)); // add this when FB authentication happens
	}
	
	navbarDiv.appendChild(navbarObjects);
	
}