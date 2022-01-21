inlets = 1;
outlets = 1;

// typically outer comes first, but inner can come first instead
var swap_inner_outer = true;

var outer_fixtures = 6;
var inner_fixtures = 20;

// now we expand from RGB to all channels
var channels_per_outer_fixture = 8;
var channels_per_inner_fixture = 6;
var outer_channels = outer_fixtures * channels_per_outer_fixture; 
var inner_channels = inner_fixtures * channels_per_inner_fixture; 
var total_channels = outer_channels + inner_channels;

var input_channels = 3;
var outer_divider = input_channels * outer_fixtures;

function list() {
	var out = new Array();

	var outer_offset = 0;
	var inner_offset = 0;

	if (swap_inner_outer) { // swap inner/outer addressing
		outer_offset = +inner_channels; // by default 0 initial, push to inner 
		inner_offset = -outer_channels; // by default outer, push to 0
	}
	
	var i = 0;
	var j = 0;
	while (i < arguments.length) {
		var r = arguments[i];
		var g = arguments[i+1];
		var b = arguments[i+2];
		var uv = ((r+b)/2)|0;
		if (i < outer_divider) { // outer
			var cyan = ((b+g)/2)|0;
			out[outer_offset+j] = (r); // red
			out[outer_offset+j+1] = (r); // red-orange
			out[outer_offset+j+2] = (r); // amber
			out[outer_offset+j+3] = (g); // green
			out[outer_offset+j+4] = cyan; // cyan
			out[outer_offset+j+5] = (b); // blue
			out[outer_offset+j+6] = uv; // uv
			out[outer_offset+j+7] = 255; // dimmer
			j += channels_per_outer_fixture;
		} else { // inner
			var w = ((r+g+b)/3)|0;
			out[inner_offset+j] = (r);
			out[inner_offset+j+1] = (g);
			out[inner_offset+j+2] = (b);
			out[inner_offset+j+3] = w; // white
			out[inner_offset+j+4] = (r); // amber
			out[inner_offset+j+5] = uv; // uv
			j += channels_per_inner_fixture;
		}
		i += 3;
	}
	
	outlet(0, out);
}