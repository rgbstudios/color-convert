$(function() {
	$('#history-items').sortable();
	$('#favorite-items').sortable();

	$('[data-toggle="popover"]').popover({trigger:'hover', placement:'bottom'});

	$('#print-link').click(function() {
		$('#rgb-logo').click(); // click something useless to hide the menu first
		window.print();
	});

	$('#color-picker').colorPicker({opacity:false, dark: '#000', light: '#fff', 
		margin: -1, animationSpeed: 250, renderCallback: 
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

	// note that typing elsewhere will be ignored while color picker is open
	// b/c once it's closed the callback will be called and color will be reset
	// $('#color-picker').click(); // commenting might fix some bugs with converting back and fourth on load url param
	$('#color-detect-input').select();

	$('#color-detect-input').change(function() {
		let tmp = $('#color-detect-input').val();
		if(tmp=='') return;
		setColor($(this).val() );
		// console.log(tmp);
		// $('#color-detect-input').val(tmp);
		setTimeout( ()=>$('#color-detect-input').val(tmp), 10);
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
	else
		setColor('#000');
	// $('#color-picker').colorPicker().colorPicker.render();
});