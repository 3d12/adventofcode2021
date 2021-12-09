const fs = require('fs');
const readline = require('readline');

let inputArr = [];

async function openFileForReading(file) {
	const fileStream = fs.createReadStream(file);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	for await (const line of rl) {
		try {
			inputArr.push(line);
		} catch(e) {
			console.error(e);
		}
	}
}

function parseNumbers(line) {
	let regex = /(\w+) (\w+) (\w+) (\w+) (\w+) (\w+) (\w+) (\w+) (\w+) (\w+) \| (\w+) (\w+) (\w+) (\w+)/;
	let found = line.match(regex);
	let signalPatterns = [];
	let outputValues = [];
	for (let i=1; i<11; i++) {
		signalPatterns.push(found[i]);
	}
	for (let i=11; i<15; i++) {
		outputValues.push(found[i]);
	}
	return { signalPatterns: signalPatterns, outputValues: outputValues };
}

(async function mainExecution() {
	await openFileForReading('input.txt');
	let totalAppearances = 0;
	for (const line of inputArr) {
		let parsed = parseNumbers(line);
		totalAppearances += parsed.outputValues.filter(e =>
				e.length === 2 || e.length === 4 || e.length === 3 || e.length === 7).length
	}
	console.log("Answer found! " + totalAppearances);
})();
