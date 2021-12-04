const fs = require('fs');
const readline = require('readline');

let binaryInputArr = [];

async function openFileForReading(file) {
	const fileStream = fs.createReadStream(file);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	for await (const line of rl) {
		try {
			//directionArr.push(parseInt(line));
			binaryInputArr.push(line);
		} catch(e) {
			console.error(e);
		}
	}
}

(async function mainExecution() {
	await openFileForReading('input.txt');
	let positionalCounts = [];
	const lengthCheckString = binaryInputArr[0];
	for (let i=0; i<lengthCheckString.length; i++) {
		positionalCounts.push({ zeroes: 0, ones: 0 });
	}
	for (const binaryInput of binaryInputArr) {
		for (let i=0; i<binaryInput.length; i++) {
			if (binaryInput[i] === '0') {
				positionalCounts[i].zeroes++;
			} else if (binaryInput[i] === '1') {
				positionalCounts[i].ones++;
			}
		}
	}
	let gammaRate = [];
	let epsilonRate = [];
	for (let i=0; i<positionalCounts.length; i++) {
		if (positionalCounts[i].zeroes > positionalCounts[i].ones) {
			gammaRate.push('0');
			epsilonRate.push('1');
		} else if (positionalCounts[i].ones > positionalCounts[i].zeroes) {
			gammaRate.push('1');
			epsilonRate.push('0');
		}
	}
	let gammaRateString = gammaRate.join('');
	let gammaRateInt = parseInt(gammaRateString, 2);
	let epsilonRateString = epsilonRate.join('');
	let epsilonRateInt = parseInt(epsilonRateString, 2);
	console.log("Answer found! " + (gammaRateInt * epsilonRateInt));
})();
