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
		let val = clamp(parseInt($(this).val() ),0,255);
		setRGB( { r : val } );
	});
	$('.green').change(function() {
		let val = clamp(parseInt($(this).val() ),0,255);
		setRGB( { g : val } );
	});
	$('.blue').change(function() {
		let val = clamp(parseInt($(this).val() ),0,255);
		setRGB( { b : val } );
	});
	$('#rgb-input').change(function() {
		let rgb = getRGBFromText($(this).val() );
		if(rgb)
			setRGB(rgb);
	});
	$('#hex-input').change(function() {
		let rgb = getRGBFromHex($(this).val() );
		if(rgb)
			setRGB(rgb);
	});

});


function clamp(num, min, max) {
	if(isNaN(num) )
		return 0;
	return num <= min ? min : num >= max ? max : num;
}

function getRGBFromText(str) {
	let vals = getValsFromText(str, 3, 0,255);
	if(vals)
		return {
			r: vals[0],
			g: vals[1],
			b: vals[2]
		};
	else
		return false
}

function getValsFromText(str, numVals, min, max) {
	str = str.split(',');
	if(str.length<numVals)
		return false;

	let vals = [];
	for(let i=0; i<numVals; i++) {
		vals[i] = clamp(parseInt(str[i].replace(/\D/g,'') ),min,max);
		if(isNaN(vals[i]) )
			return false;
	}

	return vals;
}

function getRGBFromHex(str) {
	str = str.replace(/[^0-9,a-f,A-F]+/g,'');

	let vals = [];
	if(str.length==6) {
		for(let i=0;i<3; i++)
			vals[i] = clamp(parseInt(str.substr(i*2,2), 16),0,255);
	}
	else if(str.length==3) { //shorthand
		for(let i=0;i<3; i++)
			vals[i] = clamp(17*parseInt(str.substr(i,1), 16),0,255);
	}
	else {
		return false;
	}

	return {
		r: vals[0],
		g: vals[1],
		b: vals[2]
	};
}

function setRGB(rgb) {
	let r = rgb.r == undefined ? clamp(parseInt($('#rgb-red-input').val() ),0,255) : rgb.r;
	let g = rgb.g == undefined ? clamp(parseInt($('#rgb-green-input').val() ),0,255) : rgb.g;
	let b = rgb.b == undefined ? clamp(parseInt($('#rgb-blue-input').val() ),0,255) : rgb.b;

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
