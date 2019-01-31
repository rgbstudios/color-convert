let isSlick = false;

$(function() {

	// $('#title-header').css('color','#f00');

	$('#color-detect-input').select();

	checkSlick();

	$('.btn-copy').click(function() {
		let input = $(this).parent().parent().children()[0];
		input.focus();
		input.setSelectionRange(0, input.value.length);
		document.execCommand('copy');
	});

	$('.red').change(function() {
		setRGB( { r : clamp($(this).val(),0,255) } );
	});
	$('.green').change(function() {
		setRGB( { g : clamp($(this).val(),0,255) } );
	});
	$('.blue').change(function() {
		setRGB( { b : clamp($(this).val(),0,255) } );
	});
	// $('#rgb-input').change(function() {

	// });

});


function clamp(num, min, max) {
	if(isNaN(num) )
		return false;
	return num <= min ? min : num >= max ? max : num;
}

function setRGB(rgb) {
	let r = rgb.r == undefined ? $('#rgb-red-input').val() : rgb.r;
	let g = rgb.g == undefined ? $('#rgb-green-input').val() : rgb.g;
	let b = rgb.b == undefined ? $('#rgb-blue-input').val() : rgb.b;

	console.log(r,g,b);

	$('#rgb-input').val('rgb(' + r + ',' + g + ',' + b + ')');
	$('#hex-input').val(RGBtoHex(parseInt(r), parseInt(g), parseInt(b) ) );

	$('#rgb-red-input').val(r);
	$('#rgb-red-input-range').val(r);
	$('#rgb-green-input').val(g);
	$('#rgb-green-input-range').val(g);
	$('#rgb-blue-input').val(b);
	$('#rgb-blue-input-range').val(b);
}

function RGBtoHex(r, g, b) {
	r = r.toString(16);
	g = g.toString(16);
	b = b.toString(16);
	r = r.length == 1 ? '0' + r : r;
	g = g.length == 1 ? '0' + g : g;
	b = b.length == 1 ? '0' + b : b;

	return ('#' + r + g + b).toUpperCase();
}

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
