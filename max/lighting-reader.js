const Max = require('max-api');
const path = require('path');

const fs = require('fs');

var output, rows, framerate;

Max.post(`Starting script: ${path.basename(__filename)}`);
load(process.argv.pop());

function load(fn) {
	Max.post(`Loading design: ${fn}`);
	const file = fs.readFileSync(fn, 'utf8')
	output = JSON.parse(file);
	rows = output['data'].length;
	framerate = output['framerate'];
	const fixtures = output['data'][0].length;
	const channels = output['data'][0][0].length;
	Max.post(`Loaded metadata: ${rows} rows x ${fixtures} fixtures x ${channels} channels @ ${framerate} fps`);
}

Max.addHandler('time', (time) => {
	if (!output) {
		return;
	}
	
	const roundedRow = Math.round(time * framerate);
	const row = Math.max(0, Math.min(roundedRow, rows-1));

	let colors = ['colors'];
	const data = output['data'][row];
	let k = 1;
	for (let i = 0; i < data.length; i++) {
		for (let j = 0; j < data[i].length; j++) {
			const x = data[i][j];
			colors.push(x);
			k++;
		}
	}
	Max.outlet(colors);
});

Max.addHandler('load', (fn) => {
	load(fn);
});