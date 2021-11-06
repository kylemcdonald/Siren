inlets = 1;
outlets = 1;

var cache = null;
var state = null;

var channels_per_fixture = 3;
var outer_fixtures = 8;
var inner_fixtures = 12;

var outer_channels = outer_fixtures * channels_per_fixture; 
var inner_channels = inner_fixtures * channels_per_fixture; 
var total_channels = outer_channels + inner_channels;

function list() {
	if (state == null) {
		return;
	}
	var out = new Array();

	var c = 0;
	while(c < outer_channels) {
		out[c] = arguments[c] * state.ann_out +
			arguments[c+total_channels] * state.unann_out;
		c++;
	}
	while(c < total_channels) {
		out[c] = arguments[c] * state.ann_in +
			arguments[c+total_channels] * state.unann_in;
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
			cache[c] = Math.max(cache[c] * state.lp_out, out[c]);
			c++;
		}
		while(c < total_channels) {
			cache[c] = Math.max(cache[c] * state.lp_in, out[c]);
			c++;
		}
	}

	for (i = 0; i < total_channels; i++) {
		out[i] = cache[i];
		if (i < outer_channels) {
			out[i] *= state.b_out / 255.;
		}
		out[i] = Math.max(out[i], state.white);
		out[i] = Math.min(255, out[i]) | 0;
	}
	
	outlet(0, out);
}

function anything(val) {
	if (state == null) {
		state = {};
	}
	state[messagename] = val;
	//post(messagename, val);
}

outlet(0, 'bang');