let isSlick = false;

$(function() {

	// $('#title-header').css('color','#f00');

	$('#color-detect-input').select();

	checkSlick();
});

$(window).resize(checkSlick);

function checkSlick() {
	if(window.innerWidth < 992) {
		if(!isSlick) {
			$('#color-sections').slick({
				dots: true,
				arrows: true,
				mobileFirst: true
			});
			$('input[type=range').css('display','none');
		}
		isSlick = true;
	} else {
		if(isSlick) {
			$('#color-sections').slick('unslick');
			$('input[type=range').css('display','');
		}
		isSlick = false;
	}	
}

window.onkeyup = function(e) {
	let key = e.keyCode ? e.keyCode : e.which;
}
