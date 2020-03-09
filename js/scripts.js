// todo:
// "cmyk-" in the textbox breaks it?
//make note when they enter cmyk to get another color it's because it's converting it with/without key, they're both the same color

// BUG: first time they try to change the color or click random it doesnt work?

$(function() {
	$('#history-items').sortable();
	$('#favorite-items').sortable();

	$('[data-toggle="popover"]').popover({trigger:'hover', placement:'bottom'});

	$('#color-picker').colorPicker({opacity:false, dark: '#000', light: '#fff', 
		margin: -1, animationSpeed: 250, renderCallback: 
		function(elm, toggled) {
			$('#hsl-input').val(elm.val() );
			setColor($('#hsl-input').val(), false);
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
		copyText(window.location.href);
		let hex = $('#hex-input').val();
		makeToast('<i class="fas fa-check"></i> Copied','<b>Link copied successfully</b><br>'
			+ '<div class="color-preview" style="background-color:' + hex + ';"></div>' + hex);
		$('#link-btn').focus();
	});
	$('.btn-copy').click(function() {
		refreshColor();
		let input = $(this).parent().parent().children()[0];
		input.focus();
		input.setSelectionRange(0, input.value.length);
		document.execCommand('copy');
		makeToast('<i class="fas fa-check"></i> Copied','<b>Color copied successfully</b><br>'
			+ '<div class="color-preview" style="background-color:' + $('#hex-input').val() + ';"></div>' + input.value);
		if(window.innerWidth < 992) { // if mobile then unfocus input for cleaner experience
			$(this).focus();
		}
	});

	$('#color-picker').click(); // commenting might fix some bugs with converting back and fourth on load url param
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

function setColor(str, updateColorPicker=true) { //using w3 library
	if(str.indexOf('hsv') != -1 || str.indexOf('hsb') != -1) { // special case for hsv/hsb
		let strArr = str.replace(' ',',').split(','); // split into array based off commas and/or spaces
		for(let i=0; i<strArr.length; i++)
			strArr[i] = parseFloat(strArr[i].replace(/[^\d.]/g, '') ); // regex removes non digits and periods
		strArr = strArr.filter(function(arr) {
			return ! isNaN(arr);
		});

		let convertedHSL = HSVtoHSL( {h: strArr[0], s: strArr[1]/100, v: strArr[2]/100} );
		// console.log(convertedHSL);
		setColor('hsl(' + convertedHSL.h + ', ' + convertedHSL.s*100 + '%, ' + convertedHSL.l*100 + '%)'); // call setColor with converted HSL value
		return;
	}

	// console.log(str);

	let c = w3color(str);
	if(!c.valid) return false;

	setRGB(c.toRgb() );

	// console.log(c.toHexString() );

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

	// setRGB(c.toRgb() ); // do it again so color isn't messed up

	let hex = $('#hex-input').val();

	$('.btn:not(.no-color)').css('color', hex);
	if(!c.isDark() ) {
		$('.btn:not(.no-color)').addClass('dark');
	}
	else {
		$('.btn:not(.no-color)').removeClass('dark');
	}

	$('#color-picker').val(hex);
	$('#color-picker').css('background-color', hex);
	if(updateColorPicker)
		$('#color-picker').colorPicker().colorPicker.render();

	//set url if already set
	let url = new URL(window.location.href);
	let q = url.searchParams.get('q');
	if(q)
		history.replaceState({}, '', '?q=' + $('#hex-input').val().substr(1) );

	$('#picker').css('fill', hex);
	$('#drop').css('fill', hex);

	$('.theme').attr('content', hex);

	addColorItem('history', hex);
}

// make sure color inputs are valid before continuing
function refreshColor() {
	setColor($('#color-picker').css('background-color') );
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

	let rtn = '';
	if(hexSettings.usePound) rtn += '#';
	if(hexSettings.useCaps)
		return rtn + (r + g + b).toUpperCase();
	else
		return rtn + (r + g + b).toLowerCase();
}

// todo: unimplemented
const colorNames = ['AliceBlue','AntiqueWhite','Aqua','Aquamarine','Azure','Beige','Bisque','Black','BlanchedAlmond','Blue','BlueViolet','Brown','BurlyWood','CadetBlue','Chartreuse','Chocolate','Coral','CornflowerBlue','Cornsilk','Crimson','Cyan','DarkBlue','DarkCyan','DarkGoldenRod','DarkGray','DarkGrey','DarkGreen','DarkKhaki','DarkMagenta','DarkOliveGreen','DarkOrange','DarkOrchid','DarkRed','DarkSalmon','DarkSeaGreen','DarkSlateBlue','DarkSlateGray','DarkSlateGrey','DarkTurquoise','DarkViolet','DeepPink','DeepSkyBlue','DimGray','DimGrey','DodgerBlue','FireBrick','FloralWhite','ForestGreen','Fuchsia','Gainsboro','GhostWhite','Gold','GoldenRod','Gray','Grey','Green','GreenYellow','HoneyDew','HotPink','IndianRed','Indigo','Ivory','Khaki','Lavender','LavenderBlush','LawnGreen','LemonChiffon','LightBlue','LightCoral','LightCyan','LightGoldenRodYellow','LightGray','LightGrey','LightGreen','LightPink','LightSalmon','LightSeaGreen','LightSkyBlue','LightSlateGray','LightSlateGrey','LightSteelBlue','LightYellow','Lime','LimeGreen','Linen','Magenta','Maroon','MediumAquaMarine','MediumBlue','MediumOrchid','MediumPurple','MediumSeaGreen','MediumSlateBlue','MediumSpringGreen','MediumTurquoise','MediumVioletRed','MidnightBlue','MintCream','MistyRose','Moccasin','NavajoWhite','Navy','OldLace','Olive','OliveDrab','Orange','OrangeRed','Orchid','PaleGoldenRod','PaleGreen','PaleTurquoise','PaleVioletRed','PapayaWhip','PeachPuff','Peru','Pink','Plum','PowderBlue','Purple','RebeccaPurple','Red','RosyBrown','RoyalBlue','SaddleBrown','Salmon','SandyBrown','SeaGreen','SeaShell','Sienna','Silver','SkyBlue','SlateBlue','SlateGray','SlateGrey','Snow','SpringGreen','SteelBlue','Tan','Teal','Thistle','Tomato','Turquoise','Violet','Wheat','White','WhiteSmoke','Yellow','YellowGreen'];
const colorHexes = ['f0f8ff','faebd7','00ffff','7fffd4','f0ffff','f5f5dc','ffe4c4','000000','ffebcd','0000ff','8a2be2','a52a2a','deb887','5f9ea0','7fff00','d2691e','ff7f50','6495ed','fff8dc','dc143c','00ffff','00008b','008b8b','b8860b','a9a9a9','a9a9a9','006400','bdb76b','8b008b','556b2f','ff8c00','9932cc','8b0000','e9967a','8fbc8f','483d8b','2f4f4f','2f4f4f','00ced1','9400d3','ff1493','00bfff','696969','696969','1e90ff','b22222','fffaf0','228b22','ff00ff','dcdcdc','f8f8ff','ffd700','daa520','808080','808080','008000','adff2f','f0fff0','ff69b4','cd5c5c','4b0082','fffff0','f0e68c','e6e6fa','fff0f5','7cfc00','fffacd','add8e6','f08080','e0ffff','fafad2','d3d3d3','d3d3d3','90ee90','ffb6c1','ffa07a','20b2aa','87cefa','778899','778899','b0c4de','ffffe0','00ff00','32cd32','faf0e6','ff00ff','800000','66cdaa','0000cd','ba55d3','9370db','3cb371','7b68ee','00fa9a','48d1cc','c71585','191970','f5fffa','ffe4e1','ffe4b5','ffdead','000080','fdf5e6','808000','6b8e23','ffa500','ff4500','da70d6','eee8aa','98fb98','afeeee','db7093','ffefd5','ffdab9','cd853f','ffc0cb','dda0dd','b0e0e6','800080','663399','ff0000','bc8f8f','4169e1','8b4513','fa8072','f4a460','2e8b57','fff5ee','a0522d','c0c0c0','87ceeb','6a5acd','708090','708090','fffafa','00ff7f','4682b4','d2b48c','008080','d8bfd8','ff6347','40e0d0','ee82ee','f5deb3','ffffff','f5f5f5','ffff00','9acd32'];
