inlets = 1;
outlets = 15;
var scale = 1/255.;
function list(r)
{
	j = 0;
	for (i = 0; i < 15; i++) {
		out = [
			'bgcolor',
			arguments[j+0]*scale,
			arguments[j+1]*scale,
			arguments[j+2]*scale];
		outlet(i, out);
		j += 6;
	}
}