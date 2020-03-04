// TODO: make dragging GUI picker not a problem for cluttering history, limit to every 1s or something?
// TODO: repeat color bug: if same color as previous then ignore it
// TODO: make this file a color-item.js file, used generically for both history and favorites

let colorHistory = {};
let nextIdx = 0;

// BUG: when page is reloaded hex changes slightly (from conversion probably)

// called whenever a color is changed to
function addHistory(hex) {
	if(hex == colorHistory[nextIdx-1]) return false; // duplicate of previous

	addHistoryElement(hex, nextIdx);
	colorHistory[nextIdx++] = hex;
}

// renders the history item on the page
function addHistoryElement(hex, idx) {
	$('#history-modal .modal-body').prepend(
		'<div class="history-item">'
	+	'<button class="btn open-btn no-color" title="Open Color" data-toggle="popover" onclick="openColor(this, ' + idx + ');"><i class="fas fa-external-link-alt"></i></button>'
	+	'<input class="form-control color-name" type="text" placeholder="Name your color (optional)">'
	+	'<div class="history-preview" style="background-color:' + hex + ';"></div>'
	+	'<span>' + hex + '</span>'
	+	'<button class="btn copy-btn no-color" title="Copy" data-toggle="popover" onclick="copyColor(this, ' + idx + ');"><i class="fas fa-copy"></i></button>'
	+	'<button class="btn link-btn no-color" title="Get Link" data-toggle="popover" onclick="copyColorLink(this, ' + idx + ');"><i class="fas fa-link"></i></button>'
	+	'<button class="btn delete-btn no-color" title="Remove" data-toggle="popover" onclick="removeColor(this, ' + idx + ');"><i class="fas fa-trash"></i></button>'
	+	'</div>'
	);

	$('[data-toggle="popover"]').popover({trigger:'hover', placement:'bottom'});
}

// don't need idx if cant have duplicate colors in history (just move color to top instead)
// then dont need idx as param can just get color from getting parent then getting span

// utility functions below
// signature will eventually include a 2nd param for colorMode, which can either be HISTORY or FAVORITES
// so it knows which vars and UI to use

// open the color in this page, then close the modal
// don't set history again when setting color? Move history item to top?
function openColor(elm, idx) {
	setColor(colorHistory[idx]);
	$('#history-modal').modal('hide');
}

// copy the color hex to clipboard
function copyColor(elm, idx) {

}

// copy link to color hex to clipboard
function copyColorLink(elm, idx) {

}

let thingy;
// remove color from history (variable and fade out of UI)
function removeColor(elm, idx) {
	$(elm.parentElement).fadeOut();
	delete colorHistory[idx];
}

function downloadColors() {

}

function uploadColors() {

}

function removeAllColors() {

}