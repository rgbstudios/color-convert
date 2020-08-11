// TODO: make dragging GUI picker not a problem for cluttering history, limit to every 1s or something?
// TODO: make this file a color-item.js file, used generically for both history and favorites

// BUG: when page is reloaded hex changes slightly (from conversion probably)

// TODO: when  a favorite is added then removed, the favorite icon stays filled, and it refuses to add the favorite 
// because it was most recently added

let prevAddedHistory = '';
let prevAddedFavorite = '';

// called whenever a color is changed to
function addColorItem(mode, hex, name='') {
	if(mode == 'history') {
		if(hex == prevAddedHistory) return false; // ignore if same as previous color (duplicate)
		prevAddedHistory = hex;
		$('#favorite-btn').html('<i class="far fa-heart"></i>'); // new color therefore empty heart
		$('#favorite-btn i').removeClass('heartBeat');
		// TODO: loop through all favorites in modal and make sure current isn't already one of them, and if it is then fill heart
		// TODO: upon removing a color, unfill favorite-btn
	}
	else { // 'favorite'
		if(hex == prevAddedFavorite) return false; // ignore if same as previous color (duplicate)
		prevAddedFavorite = hex;
		$('#favorite-btn').html('<i class="fas fa-heart"></i>'); // add favorite therefore filled heart
		makeToast('<i class="fas fa-check"></i> Favorite Added &nbsp;','<b>Added color to favorites list</b><br>'
			+ '<i class="fas fa-heart" style="color:' + hex + ';"></i> ' + hex);
		$('#favorite-btn i').addClass('heartBeat');
	}

// todo: add move up/down arrow btns for sorting list on mobile
// then add css to make up/down arrows hidden on desktop and drag arrows hidden on mobile

	$('#' + mode + '-modal .modal-body').prepend(
		'<div class="' + mode + '-item color-item">'
	+		'<button class="btn open-btn no-color" title="Open Color" data-toggle="popover" onclick="openColor(this, \'' + mode + '\');"><i class="fas fa-external-link-alt"></i></button>'
	+		'<input class="form-control color-name" type="text" placeholder="Name your color (optional)" value="' + name + '">'
	+		'<br class="mobile-only">'
	+		'<div class="color-preview" style="background-color:' + hex + ';"></div>'
	+		'<span>' + hex + '</span>'
	+		'<button class="btn copy-btn no-color" title="Copy" data-toggle="popover" onclick="copyColor(this);"><i class="fas fa-copy"></i></button>'
	+		'<button class="btn link-btn no-color" title="Get Link" data-toggle="popover" onclick="copyColorLink(this);"><i class="fas fa-link"></i></button>'
	+		'<button class="btn delete-btn no-color" title="Remove" data-toggle="popover" onclick="removeColor(this);"><i class="fas fa-trash"></i></button>'
	+		'<i class="fas fa-arrows-alt" style="cursor:move;" title="Drag to Change Order" data-toggle="popover"></i>'
	+	'</div>'
	);

	$('[data-toggle="popover"]').popover({trigger:'hover', placement:'bottom'}); // add popovers to newly added btns
}

// utility functions below
// signature will eventually include a 2nd param for colorMode, which can either be HISTORY or FAVORITES
// so it knows which vars and UI to use

// open the color in this page, then close the modal
// don't set history again when setting color? Move history item to top?
function openColor(elm, mode) {
	let hex = $(elm.parentElement).find('span').html();
	setColor(hex);
	$('#' + mode + '-modal').modal('hide');
}

// copy the color hex to clipboard
function copyColor(elm) {
	let hex = $(elm.parentElement).find('span').html();
	// using this instead of copyText(hex) because dynamically created buttons won't run execCommand('copy') on click
	navigator.clipboard.writeText(hex);
	makeToast('<i class="fas fa-check"></i> Copied','<b>Color copied successfully</b><br>'
		+ '<div class="color-preview" style="background-color:' + hex + ';"></div>' + hex);
}

// make and copy link to color hex to clipboard
function copyColorLink(elm) {
	let hex = $(elm.parentElement).find('span').html();
	history.replaceState({}, '', '?q=' + hex.substr(1) );
	// using this instead of copyText(window.location.href) because dynamically created buttons won't run execCommand('copy') on click
	navigator.clipboard.writeText(window.location.href);
	makeToast('<i class="fas fa-check"></i> Copied','<b>Link copied successfully</b><br>'
		+ '<div class="color-preview" style="background-color:' + hex + ';"></div>' + hex);
}

function removeColor(elm) {
	$(elm.parentElement).fadeOut(500, ()=> $(elm.parentElement).remove() );
}

function removeAllColors(mode) {
	$('.' + mode + '-item').each(
		(idx, elm)=> $(elm).fadeOut(500, ()=> $(elm).remove() )
	);
}

function downloadColors(mode) {
	let txt = '';
	$('.' + mode + '-item').each(
		(idx, elm)=> txt += $(elm).find('input[type=text]').val() + ':' + $(elm).find('span').html() + '\r\n'
	);

	downloadFile('Color Converter - ' + capitalize(mode) + (mode=='favorite' ? 's' : ''), txt);
}

function uploadColors(mode) {
	$('#' + mode + '-file-input').click();
}

$( ()=> {
	// $('#upload-history-btn').click($('#history-file-input').click);

	$('#history-file-input').change( ()=> getFile('history') );
	$('#favorite-file-input').change( ()=> getFile('favorite') );

	$('#favorite-btn').click( ()=> {
		refreshColor();
		addColorItem('favorite', $('#hex-input').val() );
	});

});

function getFile(mode) {
	if(!window.FileReader) return; // browser not supported

	let input = $('#' + mode + '-file-input').get(0);
	let reader = new FileReader();
	if(input.files.length) { // file exists
		let textFile = input.files[0];
		reader.readAsText(textFile);
		$(reader).on('load', (evt)=> processFile(evt, mode) );
	}
}

function processFile(evt, mode) {
	let file = evt.target.result
	if(file && file.length) {
		removeAllColors();
		let results = file.split('\r\n');
		for(let i=results.length-1; i>=0; i--) {
			let name = results[i].split(':')[0];
			let hex = results[i].split(':')[1];
			if(hex) // check if color exists
				addColorItem(mode, hex, name);
		}
	}
}
