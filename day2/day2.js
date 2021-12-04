const fs = require('fs');
const readline = require('readline');

let directionArr = [];

async function openFileForReading(file) {
	const fileStream = fs.createReadStream(file);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	for await (const line of rl) {
		try {
			//directionArr.push(parseInt(line));
			directionArr.push(line);
		} catch(e) {
			console.error(e);
		}
	}
}

function interpretDirection(inputDirection) {
	let hmodifier = 0;
	let vmodifier = 0;
	const regex = /(\w+) (\d+)/;
	const found = inputDirection.match(regex);
	const direction = found[1];
	const distance = parseInt(found[2]);
	switch (direction) {
		case 'forward': hmodifier += distance;
			break;
		case 'down': vmodifier += distance;
			break;
		case 'up': vmodifier -= distance
			break;
	}
	return { hmodifier: hmodifier, vmodifier: vmodifier };
}

(async function mainExecution() {
	await openFileForReading('input.txt');
	let hposition = 0;
	let vposition = 0;
	for (const direction of directionArr) {
		let outcome = interpretDirection(direction);
		console.log("hmodifier: " + outcome.hmodifier + ", vmodifier: " + outcome.vmodifier)
		hposition += outcome.hmodifier;
		if (vposition + outcome.vmodifier < 0) {
			vposition = 0;
		} else {
			vposition += outcome.vmodifier;
		}
		console.log("Current position: " + hposition + "," + vposition);
	}
	console.log("Answer found! " + (hposition * vposition));
})();
