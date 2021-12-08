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

function crabFuel(spaces) {
	let totalFuel = 0;
	for (let i = spaces; i > 0; i--) {
		totalFuel += i;
	}
	return totalFuel;
}

(async function mainExecution() {
	await openFileForReading('input.txt');
	let currentFuel = 0;
	let bestFuel = 99999999;
	let bestIndex = 0;
	let crabPositionArr = inputArr[0].split(',');
	let maxIndex = crabPositionArr.reduce((a,b) => { return Math.max(a,b) });
	for (let i = 0; i<maxIndex; i++) {
		currentFuel = 0;
		// try aligning all the crabs to this index
		for (crab of crabPositionArr) {
			currentFuel += crabFuel(Math.abs(crab - i));
		}
		// if this uses less fuel than bestFuel, save this index to bestIndex
		if (currentFuel < bestFuel) {
			bestFuel = currentFuel;
			bestIndex = i;
		}
	}
	console.log("Answer found! Index " + bestIndex + " uses the least fuel at " + bestFuel);
})();
