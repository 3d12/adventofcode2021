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

function processDay(inputArray) {
	let fishToBeBorn = 0;
	let outputArray = [];
	for (const fish of inputArray) {
		if (fish === 0) {
			fishToBeBorn++;
			outputArray.push(6);
		} else {
			outputArray.push(fish - 1);
		}
	}
	for (let i=0; i<fishToBeBorn; i++) {
		outputArray.push(8);
	}
	return outputArray;
}

(async function mainExecution() {
	await openFileForReading('input.txt');
	let lanternFishArray = inputArr[0].split(',').map(e => parseInt(e));
	let days = 0;
	let totalFish = 0;
	while (true) {
		lanternFishArray = processDay(lanternFishArray);
		days++;
		if (days === 80) {
			totalFish = lanternFishArray.length;
			break;
		}
	}
	console.log("Answer found! " + totalFish);
})();
