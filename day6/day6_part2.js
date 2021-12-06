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

function processDay(inputSerializedArray) {
	let fishToBeBorn = 0;
	let outputObject = { zero: 0, one: 0, two: 0, three: 0, four: 0, five: 0, six: 0, seven: 0, eight: 0 };
	if (inputSerializedArray.zero > 0) {
		fishToBeBorn = inputSerializedArray.zero;
	}
	outputObject.zero = inputSerializedArray.one;
	outputObject.one = inputSerializedArray.two;
	outputObject.two = inputSerializedArray.three;
	outputObject.three = inputSerializedArray.four;
	outputObject.four = inputSerializedArray.five;
	outputObject.five = inputSerializedArray.six;
	outputObject.six = (inputSerializedArray.seven + fishToBeBorn);
	outputObject.seven = inputSerializedArray.eight;
	outputObject.eight = fishToBeBorn;
	return outputObject;
}

function serializeArray(inputArray) {
	let returnObject = { zero: 0, one: 0, two: 0, three: 0, four: 0, five: 0, six: 0, seven: 0, eight: 0 };
	for (const item of inputArray) {
		switch (item) {
			case 0: returnObject.zero++;
				break;
			case 1: returnObject.one++;
				break;
			case 2: returnObject.two++;
				break;
			case 3: returnObject.three++;
				break;
			case 4: returnObject.four++;
				break;
			case 5: returnObject.five++;
				break;
			case 6: returnObject.six++;
				break;
			case 7: returnObject.seven++;
				break;
			case 8: returnObject.eight++;
				break;
			default: return new Error("Invalid number in serialization: " + item);
		}
	}
	return returnObject;
}

(async function mainExecution() {
	await openFileForReading('input.txt');
	let lanternFishArray = serializeArray(inputArr[0].split(',').map(e => parseInt(e)));
	console.log(lanternFishArray);
	let days = 0;
	let totalFish = 0;
	while (true) {
		console.log("DEBUG: Processing day " + (days+1) + "...");
		lanternFishArray = processDay(lanternFishArray);
		days++;
		if (days === 256) {
			totalFish = (lanternFishArray.zero + lanternFishArray.one
				+ lanternFishArray.two + lanternFishArray.three
				+ lanternFishArray.four + lanternFishArray.five
				+ lanternFishArray.six + lanternFishArray.seven
				+ lanternFishArray.eight);
			break;
		}
	}
	console.log("Answer found! " + totalFish);
})();
