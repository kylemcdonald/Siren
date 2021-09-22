inlets = 1;
outlets = 1;

function list() {
	var out = new Array();
	
	var i = 0;
	var j = 0;
	while (i < arguments.length) {
		var r = arguments[i];
		var g = arguments[i+1];
		var b = arguments[i+2];
		out[j] = r;
		out[j+1] = g;
		out[j+2] = b;
		out[j+3] = ((r+g+b)/3)|0;
		i += 3;
		j += 4;
	}
	
	outlet(0, out);
}