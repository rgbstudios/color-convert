$(function() {
	$('#use-cookies-checkbox').change(function() {
		let useCookies = $('#use-cookies-checkbox').is(':checked');
		if(!useCookies) {
			removeAllCookies();
		} else {
			storeCookies(['history', 'favorite']);
		}
	});
	$('#remove-cookies-btn').click(removeAllCookies);

	loadCookies();
});

// remove all cookies and show a toast
function removeAllCookies() {

	console.log('removing cookies');

	Cookies.remove('history', {path: ''});
	Cookies.remove('favorite', {path: ''});

	makeToast('<i class="fas fa-check"></i> Removed Cookies', 'All (3) cookies were removed successfully');

	updateCookieSettingsDisplay(0);
	$('#use-cookies-checkbox').attr('checked',false);

	console.log('removed cookies');
}

// update cookie number display and button disabled attr
function updateCookieSettingsDisplay(numCookies) {
	console.log('updating cookie settings display');
	$('#cookie-info-number').html(numCookies);
	$('#remove-cookies-btn').attr('disabled', numCookies==0);
	console.log(numCookies);
	console.log('updated cookie settings display');
}

// get history, favorites, and settings and store those cookies
// called when checkbox is changed or favorites, history, or settings are changed
// TODO: settings
function storeCookies(modes) { // mode is history or favorite

	console.log('storing cookies');

	let useCookies = $('#use-cookies-checkbox').is(':checked');
	if(!useCookies) {
		console.log('not storing cookies');
		return;
	}

	for(let mode of modes) {
		Cookies.set(mode, getColorList(mode), {path: ''} );
	}

	updateCookieSettingsDisplay(3); // history, favorites, and settings = 3 cookies

	console.log('stored cookies');
}

// load favorites, history, and settings
// called on page load
// doesn't run if there are no cookies
function loadCookies() {

	// TODO
	// if there are cookies, then check the box, show toast for imported num of favorites and history

	console.log('loading cookies');

	for(let mode of ['history', 'favorite']) {
		let cookie = Cookies.get(mode);
		if(cookie === undefined) continue;
		let list = cookie.split(',');
		let size = list.length / 2;
		let names = list.splice(0, size);
		let vals = list.splice(-size);

		console.log(vals);
		console.log(names);

		loadColorList(mode, names, vals);
	}

	console.log(Cookies.get('history') );
	console.log('loaded cookies');
}

// TODO: test all the cookie stuff
// then add settings to cookies (maybe)