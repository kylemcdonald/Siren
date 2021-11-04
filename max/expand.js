inlets = 1;
outlets = 1;

/*
function par_map(x) {
	if (x == 0) {
		return 0;
	}
	return ((x * 195. / 255.) + 60)|0;
}
*/

function list() {
	var out = new Array();
	
	var i = 0;
	var j = 0;
	while (i < arguments.length) {
		var r = arguments[i];
		var g = arguments[i+1];
		var b = arguments[i+2];
		//var fixture = i / 3;
		if (i < 24) {
			var sf = 0.20;
			//r=g=b=0;
			r*=sf;
			g*=sf;
			b*=sf;
			out[j] = (r);
			out[j+1] = (g);
			out[j+2] = (b);
			j += 3;
		} else {
			//r=g=b=255;
			var br = ((r+g+b)/3)|0;
			var w = br / 2;
			out[j] = 255; // dimmer
			out[j+1] = r;
			out[j+2] = g;
			out[j+3] = b;
			out[j+4] = w; // cool white
			out[j+5] = 0; // open (no strobe)
			out[j+6] = 255-br; // zoom
			out[j+7] = 0; // zoom reset (201-220, others no function)
			out[j+8] = 19; // linear dimmer
			j += 9;
		}
		i += 3;
	}
	
	outlet(0, out);
}