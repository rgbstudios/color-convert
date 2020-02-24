// todo:
// "cmyk-" in the textbox breaks it?
//make note when they enter cmyk to get another color it's because it's converting it with/without key, they're both the same color

let isSlick = false;

$(function() {

	checkSlick();

	$('#color-picker').colorPicker({opacity:false, renderCallback: 
		function(elm, toggled) {
			$('#hsl-input').val(elm.val() );
			setColor($('#hsl-input').val() );
			console.log('callback called');
		}
	});
	$('#random-btn').click(function() {
		setRGB( { r : randInt(0,255), g : randInt(0,255), b : randInt(0,255) } );
		setColor($('#rgb-input').val() );
	});
	$('#reset-btn').click(function() {
		setRGB( { r : 0, g : 0, b : 0 } );
		setColor($('#rgb-input').val() );
		window.history.replaceState(null, null, window.location.pathname);
	});
	$('#link-btn').click(function() {
		//don't store '#' in url or it messes it up
		history.replaceState({}, '', '?q=' + $('#hex-input').val().substr(1) );
		let tmp = $('<input type="text">').appendTo(document.body);
		tmp.val(window.location.href);
		tmp.select();
		document.execCommand('copy');
		tmp.remove();
		makeToast('<i class="fas fa-check"></i> Copied','<b>Link copied successfully</b><br>' + $('#hex-input').val() );
	});
	$('.btn-copy').click(function() {
		let input = $(this).parent().parent().children()[0];
		input.focus();
		input.setSelectionRange(0, input.value.length);
		document.execCommand('copy');
		makeToast('<i class="fas fa-check"></i> Copied','<b>Color copied successfully</b><br>' + input.value);
		if(window.innerWidth < 992) { // if mobile then unfocus input for cleaner experience
			$(this).focus();
		}
	});
	
	$('#color-picker').click();
	$('#color-detect-input').select();

	$('#color-detect-input').change(function() {
		setColor($(this).val() );
	});

	$('.red').change(function() {
		let val = clamp(parseInt($(this).val() ),0,255);
		setRGB( { r : val } );
		setColor($('#rgb-input').val() );
	});
	$('.green').change(function() {
		let val = clamp(parseInt($(this).val() ),0,255);
		setRGB( { g : val } );
		setColor($('#rgb-input').val() );
	});
	$('.blue').change(function() {
		let val = clamp(parseInt($(this).val() ),0,255);
		setRGB( { b : val } );
		setColor($('#rgb-input').val() );
	});
	$('#rgb-input').change(function() {
		let rgb = getValsFromText($(this).val(),'rgb');
		if(rgb) {
			setRGB(rgb);
			setColor($('#rgb-input').val() );
		}
	});
	$('#hex-input').change(function() {
		let rgb = getRGBFromHex($(this).val() );
		if(rgb) {
			setRGB(rgb);
			setColor($('#rgb-input').val() );
		}
	});

	$('.cyan').change(function() {
		$('.key').val(0); // fix for if key==100
		let val = clamp(parseInt($(this).val() ),0,100);
		setCMYK( { c : val } );
		setColor($('#cmyk-input').val() );
	});
	$('.magenta').change(function() {
		$('.key').val(0); // fix for if key==100
		let val = clamp(parseInt($(this).val() ),0,100);
		setCMYK( { m : val } );
		setColor($('#cmyk-input').val() );
	});
	$('.yellow').change(function() {
		$('.key').val(0); // fix for if key==100
		let val = clamp(parseInt($(this).val() ),0,100);
		setCMYK( { y : val } );
		setColor($('#cmyk-input').val() );
	});
	$('.key').change(function() {
		let val = clamp(parseInt($(this).val() ),0,100);
		setCMYK( { k : val } );
		setColor($('#cmyk-input').val() );
	});
	$('#cmyk-input').change(function() {
		let cmyk = getValsFromText($(this).val(),'cmyk');
		if(cmyk) {
			setCMYK(cmyk);
			setColor($('#cmyk-input').val() );
		}
	});

	$('.hsl-hue').change(function() {
		let val = clamp(parseInt($(this).val() ),0,360);
		setHSL( { h : val } );
		setColor($('#hsl-input').val() );
	});
	$('.hsl-saturation').change(function() {
		let val = clamp(parseInt($(this).val() ),0,100);
		setHSL( { s : val } );
		setColor($('#hsl-input').val() );
	});
	$('.lightness').change(function() {
		let val = clamp(parseInt($(this).val() ),0,100);
		setHSL( { l : val } );
		setColor($('#hsl-input').val() );
	});
	$('#hsl-input').change(function() {
		let hsl = getValsFromText($(this).val(),'hsl');
		if(hsl) {
			setHSL(hsl);
			setColor($('#hsl-input').val() );
		}
	});

	$('.hsv-hue').change(function() {
		let val = clamp(parseInt($(this).val() ),0,360);
		setHSV( { h : val } );
		let hsv = getValsFromText($('#hsv-input').val(),'hsv');
		hsv.s /= 100;
		hsv.v /= 100;
		let hsl = HSVtoHSL(hsv);
		hsl.s = Math.round(hsl.s*100);
		hsl.l = Math.round(hsl.l*100);
		setHSL(hsl);
		setColor($('#hsl-input').val() );
	});
	$('.hsv-saturation').change(function() {
		let val = clamp(parseInt($(this).val() ),0,360);
		setHSV( { s : val } );
		let hsv = getValsFromText($('#hsv-input').val(),'hsv');
		hsv.s /= 100;
		hsv.v /= 100;
		let hsl = HSVtoHSL(hsv);
		hsl.s = Math.round(hsl.s*100);
		hsl.l = Math.round(hsl.l*100);
		setHSL(hsl);
		setColor($('#hsl-input').val() );
	});
	$('.value').change(function() {
		let val = clamp(parseInt($(this).val() ),0,100);
		setHSV( { v : val } );
		let hsv = getValsFromText($('#hsv-input').val(),'hsv');
		hsv.s /= 100;
		hsv.v /= 100;
		let hsl = HSVtoHSL(hsv);
		hsl.s = Math.round(hsl.s*100);
		hsl.l = Math.round(hsl.l*100);
		setHSL(hsl);
		setColor($('#hsl-input').val() );
	});
	$('#hsv-input').change(function() {
		let hsv = getValsFromText($(this).val(),'hsv');
		if(hsv) {
			setHSV(hsv);
			hsv.s /= 100;
			hsv.v /= 100;
			let hsl = HSVtoHSL(hsv);
			setHSL(hsl);
			setColor($('#hsl-input').val() );
		}
	});

	//get url params
	let url = new URL(window.location.href);
	let q = url.searchParams.get('q');
	if(q)
		setColor('#'+q);
});

function clamp(num, min, max) {
	if(isNaN(num) )
		return 0;
	return num <= min ? min : num >= max ? max : num;
}

let types = {
	'rgb': [255,255,255],
	'cmyk': [100,100,100,100],
	'hsl': [360,100,100],
	'hsv': [360,100,100]
};

function getValsFromText(str, type) {
	let numVals = types[type].length;
	let maxes = types[type];

	str = str.split(',');
	if(str.length<numVals)
		return false;

	let vals = [];
	for(let i=0; i<numVals; i++) {
		vals[i] = clamp(parseInt(str[i].replace(/\D/g,'') ),0,maxes[i]);
		if(isNaN(vals[i]) )
			return false;
	}

	if(type=='rgb')
		return {r: vals[0], g: vals[1], b:vals[2]};
	if(type=='cmyk')
		return {c: vals[0], m: vals[1], y:vals[2], k:vals[3]};
	if(type=='hsl')
		return {h: vals[0], s: vals[1], l:vals[2]};
	return {h: vals[0], s: vals[1], v:vals[2]};
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
	else
		return false;

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

	$('#rgb-input').val('rgb(' + r + ', ' + g + ', ' + b + ')');
	$('#hex-input').val(RGBtoHex(parseInt(r), parseInt(g), parseInt(b) ) );

	$('#rgb-red-input').val(r);
	$('#rgb-red-input-range').val(r);
	$('#rgb-green-input').val(g);
	$('#rgb-green-input-range').val(g);
	$('#rgb-blue-input').val(b);
	$('#rgb-blue-input-range').val(b);
}

function setCMYK(cmyk) {
	let c = cmyk.c == undefined ? clamp(parseInt($('#cmyk-cyan-input').val() ),0,100) : cmyk.c;
	let m = cmyk.m == undefined ? clamp(parseInt($('#cmyk-magenta-input').val() ),0,100) : cmyk.m;
	let y = cmyk.y == undefined ? clamp(parseInt($('#cmyk-yellow-input').val() ),0,100) : cmyk.y;
	let k = cmyk.k == undefined ? clamp(parseInt($('#cmyk-key-input').val() ),0,100) : cmyk.k;

	$('#cmyk-input').val('cmyk(' + c + '%, ' + m + '%, ' + y + '%, ' + k + '%)');

	$('#cmyk-cyan-input').val(c);
	$('#cmyk-cyan-input-range').val(c);
	$('#cmyk-magenta-input').val(m);
	$('#cmyk-magenta-input-range').val(m);
	$('#cmyk-yellow-input').val(y);
	$('#cmyk-yellow-input-range').val(y);
	$('#cmyk-key-input').val(k);
	$('#cmyk-key-input-range').val(k);
}

function setHSL(hsl) {
	let h = hsl.h == undefined ? clamp(parseInt($('#hsl-hue-input').val() ),0,360) : hsl.h;
	let s = hsl.s == undefined ? clamp(parseInt($('#hsl-saturation-input').val() ),0,100) : hsl.s;
	let l = hsl.l == undefined ? clamp(parseInt($('#hsl-lightness-input').val() ),0,100) : hsl.l;

	$('#hsl-input').val('hsl(' + h + ', ' + s + '%, ' + l + '%)');

	$('#hsl-hue-input').val(h);
	$('#hsl-hue-input-range').val(h);
	$('#hsl-saturation-input').val(s);
	$('#hsl-saturation-input-range').val(s);
	$('#hsl-lightness-input').val(l);
	$('#hsl-lightness-input-range').val(l);
}

function setHSV(hsv) {
	let h = hsv.h == undefined ? clamp(parseInt($('#hsv-hue-input').val() ),0,360) : hsv.h;
	let s = hsv.s == undefined ? clamp(parseInt($('#hsv-saturation-input').val() ),0,100) : hsv.s;
	let v = hsv.v == undefined ? clamp(parseInt($('#hsv-value-input').val() ),0,100) : hsv.v;

	$('#hsv-input').val('hsv(' + h + ', ' + s + '%, ' + v + '%)');

	$('#hsv-hue-input').val(h);
	$('#hsv-hue-input-range').val(h);
	$('#hsv-saturation-input').val(s);
	$('#hsv-saturation-input-range').val(s);
	$('#hsv-value-input').val(v);
	$('#hsv-value-input-range').val(v);
}

function setColor(str) { //using w3 library
	if(str.indexOf('hsv') != -1 || str.indexOf('hsb') != -1) { // special case for hsv/hsb
		let strArr = str.replace(' ',',').split(','); // split into array based off commas and/or spaces
		for(let i=0; i<strArr.length; i++)
			strArr[i] = parseFloat(strArr[i].replace(/[^\d.]/g, '') ); // regex removes non digits and periods
		strArr = strArr.filter(function(arr) {
			return ! isNaN(arr);
		});

		let convertedHSL = HSVtoHSL( {h: strArr[0], s: strArr[1]/100, v: strArr[2]/100} );
		console.log(convertedHSL);
		setColor('hsl(' + convertedHSL.h + ', ' + convertedHSL.s*100 + '%, ' + convertedHSL.l*100 + '%)'); // call setColor with converted HSL value
		return;
	}
	
	console.log(str);

	let c = w3color(str);
	if(!c.valid) return false;

	setRGB(c.toRgb() );

	let cmyk = c.toCmyk();
	cmyk.c = Math.round(cmyk.c*100);
	cmyk.m = Math.round(cmyk.m*100);
	cmyk.y = Math.round(cmyk.y*100);
	cmyk.k = Math.round(cmyk.k*100);
	setCMYK(cmyk);

	let hsl = c.toHsl();
	hsl.s = Math.round(hsl.s*100);
	hsl.l = Math.round(hsl.l*100);
	setHSL(hsl);

	let hsv = HWBtoHSV(c.toHwb() );
	hsv.s = Math.round(hsv.s*100);
	hsv.v = Math.round(hsv.v*100);
	setHSV(hsv);

	let hex = $('#hex-input').val();
	
	// $('#title-header').css('color', hex);
	$('.btn').css('color', hex);
	if(hsl.l>50) {
		// $('#title-header').css('background-color', '#000');
		$('.btn').addClass('dark');
	}
	else {
		// $('#title-header').css('background-color', '#fff');
		$('.btn').removeClass('dark');
	}

	$('#color-picker').val(hex);
	$('#color-picker').css('background-color', hex);

	//set url if already set
	let url = new URL(window.location.href);
	let q = url.searchParams.get('q');
	if(q)
		history.replaceState({}, '', '?q=' + $('#hex-input').val().substr(1) );

	$('#picker').css('fill', hex);
	$('#drop').css('fill', hex);

	$('.theme').attr('content', hex);
}

//https://en.wikipedia.org/wiki/HWB_color_model
function HWBtoHSV(hwb) {
	let hsv = {h:hwb.h, s:1-(hwb.w/(1-hwb.b) ), v: 1-hwb.b};
	if(isNaN(hsv.s) )
		hsv.s = 1;
	return hsv;
}

//https://en.wikipedia.org/wiki/HSL_and_HSV#Conversion_HSV_to_HSL
function HSVtoHSL(hsv) {
	let h = hsv.h;
	let l = hsv.v - (hsv.v * hsv.s / 2);
	let s;
	if(l==0 || l==1)
		s = 0;
	else
		s = (hsv.v - l)/Math.min(l, 1-l);
	return {h:h, s:s, l:l};
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

function randInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) ) + min;
}

let toastIdx = 0;
function makeToast(title, body) {
	$('.container').append(
		'<div id="toast-' + (++toastIdx) + '" class="toast m-auto" data-autohide="false">'
	+	'<div class="toast-header">'
	+		'<h5 class="mr-auto">' + title + '</h5>'
	+		'<button type="button" class="close py-1 px-2" data-dismiss="toast">&times;</button>'
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

$(window).click(function(e) {
	// fix for clicking on an input while it's open
	if(e.target.id != '#color-picker')
		$('#color-picker').colorPicker('close'); //todo: this is causing problems for not rendering color-picker's val after another element was clicked
});

// window.onkeyup = function(e) {
// 	let key = e.keyCode ? e.keyCode : e.which;
// }
