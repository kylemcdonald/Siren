inlets = 1;
outlets = 1;

var weight = null;
var cache = null;

function list() {
	if (cache == null || weight == null) {
		cache = new Array();
		for (var i = 0; i < arguments.length; i++) {
			cache[i] = arguments[i];
		}
	} else {
		for (var i = 0; i < arguments.length; i++) {
			cache[i] = Math.max(cache[i] * weight, arguments[i]);
		}
	}	
	outlet(0, cache);
}

function msg_float() {
	weight = arguments[0];
}