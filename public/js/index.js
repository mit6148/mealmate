function main() {
  get('/api/whoami', {}, function(user) {
    console.log(user);
    renderNavbar(user);
  });

  /*
  	const user = { // fill out more properties later
    	_id: 'anonid',
    	name: 'Anonymous',
    	course: '0',
    	year: '2000',
    	residence: 'Maseeh',
    	times: { 01012016: 0 }, // date: time dictionary
    	halls: ['Next', 'Maseeh'],
    	aboutme: "Hi I'm anonymous",
  	};
  	renderNavbar(user);
    */
 }

 main();