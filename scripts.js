
//$('#title-header').css('color','#f00');

window.onload = function() {

	$('#color-detect-input').select();

	$('#copy-link-btn').hover(function() {
		$(this).html('<i class="fas fa-link"></i> Copy Link to Your Color');
	});
	$('#copy-link-btn').mouseleave(function() {
		$(this).html('<i class="fas fa-link"></i> Copy Link');
	});

}

window.onkeyup = function(e) {
	let key = e.keyCode ? e.keyCode : e.which;
}
