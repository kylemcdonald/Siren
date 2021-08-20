outlets = 3;

function list() {
	var r = new Array();
	var g = new Array();
	var b = new Array();
	var i = 0;
	var j = 0;
	
	while (i < arguments.length) {
		r[j] = arguments[i];
		g[j] = arguments[i+1];
		b[j] = arguments[i+2];
		i += 6;
		j += 1;
	}
	
	outlet(2, b)
	outlet(1, g);
	outlet(0, r);
}