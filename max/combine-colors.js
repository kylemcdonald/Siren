inlets = 1;
outlets = 1;

var cache = null;

// at this stage we are only doing RGB
var channels_per_fixture = 3;
var outer_fixtures = 6;
var inner_fixtures = 20;

var outer_channels = outer_fixtures * channels_per_fixture; 
var inner_channels = inner_fixtures * channels_per_fixture; 
var total_channels = outer_channels + inner_channels;

function grab(e) {
	return this.patcher.getnamed(e).getvalueof();
}

function curve(x) {
	return 1.0 - (1.0 / Math.pow(10.0, x));
}

function list() {
	var lp_in = grab('lp_in');
	var unann_out = grab('unann_out');
	var unann_in = grab('unann_in');
	var b_out = grab('b_out');
	var lp_out = grab('lp_out');
	var ann_out = grab('ann_out');
	var ann_in = grab('ann_in');
	var white = grab('white');

	// patch isn't ready yet
	if (typeof(lp_in) === 'undefined') {
		return;
	}
	
	lp_in = curve(lp_in);
	lp_out = curve(lp_out);
	
	var out = new Array();

	var c = 0;
	while(c < outer_channels) {
		out[c] = arguments[c] * ann_out +
			arguments[c+total_channels] * unann_out;
		c++;
	}
	while(c < total_channels) {
		out[c] = arguments[c] * ann_in +
			arguments[c+total_channels] * unann_in;
		c++;
	}

	if (cache == null || isNaN(cache[0])) {
		cache = new Array();
		for (i = 0; i < out.length; i++) {
			cache[i] = out[i];
		}
	} else {
		var c = 0;
		while(c < outer_channels) {
			cache[c] = Math.max(cache[c] * lp_out, out[c]);
			c++;
		}
		while(c < total_channels) {
			cache[c] = Math.max(cache[c] * lp_in, out[c]);
			c++;
		}
	}

	for (i = 0; i < total_channels; i++) {
		out[i] = cache[i];
		if (i < outer_channels) {
			out[i] *= b_out / 255.;
		}
		out[i] = Math.max(out[i], white);
		out[i] = Math.min(255, out[i]) | 0;
	}
	
	outlet(0, out);
}