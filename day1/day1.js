const fs = require('fs');
const readline = require('readline');

let depthArr = [];

async function openFileForReading(file) {
	const fileStream = fs.createReadStream(file);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	for await (const line of rl) {
		try {
			depthArr.push(parseInt(line));
		} catch(e) {
			console.error(e);
		}
	}
}

(async function mainExecution() {
	await openFileForReading('input.txt');
	let currentDepth = 0;
	let firstDepth = true;
	let numIncreases = 0;
	for (const depth of depthArr) {
		if (firstDepth != true) {
			diff = depth - currentDepth;
			if (diff > 0) {
				console.log("Depth increased from " + currentDepth + " to " + depth);
				numIncreases++;
			}
		}
		currentDepth = depth;
		firstDepth = false;
	}
	console.log("Answer found! " + numIncreases);
})();
