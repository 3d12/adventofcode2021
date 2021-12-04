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
	let command = 'null';
	let value = 0;
	const regex = /(\w+) (\d+)/;
	const found = inputDirection.match(regex);
	command = found[1];
	value = parseInt(found[2]);
	return { command: command, value: value };
}

(async function mainExecution() {
	await openFileForReading('input.txt');
	let hposition = 0;
	let vposition = 0;
	let aim = 0;
	for (const direction of directionArr) {
		let outcome = interpretDirection(direction);
		console.log("command: " + outcome.command + ", value: " + outcome.value)
		switch (outcome.command) {
			case 'up': if (aim - outcome.value < 0) {
											aim = 0;
										} else {
											aim -= outcome.value;
										}
										break;
			case 'down': aim += outcome.value;
										break;
			case 'forward': hposition += outcome.value;
											vposition += (aim * outcome.value);
										break;
		}
	}
	console.log("Answer found! " + (hposition * vposition));
})();
