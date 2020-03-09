function randInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) ) + min;
}

let toastIdx = 0;
function makeToast(title, body) {
	$('.container').append(
		'<div id="toast-' + (++toastIdx) + '" class="toast m-auto" data-autohide="false">'
	+	'<div class="toast-header">'
	+		'<h5 class="mr-auto">' + title + '</h5>'
	+		'<button type="button" class="close py-1 px-2" data-dismiss="toast">'
	+			'<i class="fas fa-times fa-xs"></i>'
	+		'</button>'
	+	'</div>'
	+	'<div class="toast-body">'
	+		body
	+	'</div>'
	+	'</div>'
	);

	let toastID = '#toast-' + toastIdx;
	$(toastID).toast('show');
	setTimeout( ()=> $(toastID).toast('hide'), 2500);
}

function copyText(str) {
	let tmp = $('<input type="text">').appendTo(document.body);
	tmp.val(str.toString() );
	tmp.select();
	document.execCommand('copy');
	tmp.remove();
}

function downloadFile(fileName, str) {
	let blob = new Blob([str], {type: 'text/plain'});
	let link = document.createElement('a');
	link.download = fileName;
	link.href = window.URL.createObjectURL(blob);
	link.click()
	link.remove();
}

function capitalize(word) {
	return word.charAt(0).toUpperCase() + word.substring(1);
}

function toggleFullscreen() {
	if(!document.fullscreenElement) {
		document.documentElement.requestFullscreen();
	}
	else if(document.exitFullscreen) {
		document.exitFullscreen(); 
	}
}