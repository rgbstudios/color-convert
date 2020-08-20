$( ()=> {

	const app = new Vue({
		el: '#app',
		data: {
			r: 0,
			g: 1,
			b: 2,
		},
		methods: {
			validateR: function() {
				let val = parseInt(Math.round($('#rgb-red-input').val() ) );
				console.log(typeof val);
				this.r = clamp(val,0,255);
				console.log(typeof this.r);
			},
			validateG: function() {
				let val = parseInt(Math.round($('#rgb-green-input').val() ) );
				this.g = clamp(val,0,255);
			},
			validateB: function() {
				let val = parseInt(Math.round($('#rgb-blue-input').val() ) );
				this.b = clamp(val,0,255);
			},
			setHex: function() {
				let rgb = hexToRGB($('#hex-input').val() );
				if(rgb) {
					this.r = rgb.r;
					this.g = rgb.g;
					this.b = rgb.b;
				}
			},
			setRGB: function() {
				let rgb = getValsFromText($('#rgb-input').val(),'rgb');
				if(rgb) {
					this.r = rgb.r;
					this.g = rgb.g;
					this.b = rgb.b;
				}
			},
		},
		computed: {
			hex: function() {
				console.log(typeof this.r);
				return RGBtoHex(this.r, this.g, this.b);
			},
			rgb: function() {
				return `rgb(${this.r}, ${this.g}, ${this.b})`;
			},
		},
	});

});

// validation

function clamp(num, min, max) {
	return isNaN(num) ? 0 : num <= min ? min : num >= max ? max : num;
}

const TYPES = {
	rgb: [255,255,255],
	cmyk: [100,100,100,100],
	hsl: [360,100,100],
	hsv: [360,100,100]
};

function getValsFromText(str, type) {
	let numVals = TYPES[type].length;
	let maxes = TYPES[type];

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

// conversion

function RGBtoHex(r, g, b, usePound=true, useCaps=true) {
	console.log(typeof r);
	console.log(r);
	console.log(r.toString(16) );

	r = r.toString(16);
	g = g.toString(16);
	b = b.toString(16);
	r = r.length == 1 ? '0' + r : r;
	g = g.length == 1 ? '0' + g : g;
	b = b.length == 1 ? '0' + b : b;

	let rtn = '';
	if(usePound) rtn += '#';
	if(useCaps) {
		return rtn + (r + g + b).toUpperCase();
	}
	else {
		return rtn + (r + g + b).toLowerCase();
	}
}

function hexToRGB(str) {
	str = str.replace(/[^0-9,a-f,A-F]+/g,''); // remove anything that's not hex

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
