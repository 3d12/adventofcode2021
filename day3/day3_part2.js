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
	let oxygenGenRating = '';
	let filteredArray = binaryInputArr;
	let positionalCounts = [];
	let binaryInputIndex = 0;
	while (oxygenGenRating === '') {
		if (filteredArray.length === 1) {
			oxygenGenRating = filteredArray[0];
			break;
		}
		const lengthCheckString = filteredArray[0];
		positionalCounts = [];
		for (let i=0; i<lengthCheckString.length; i++) {
			positionalCounts.push({ zeroes: 0, ones: 0 });
		}
		for (let i=0; i<filteredArray.length; i++) {
			let currentString = filteredArray[i];
			for (let j=0; j<positionalCounts.length; j++) {
				if (currentString[j] === '0') {
					positionalCounts[j].zeroes++;
				} else if (currentString[j] === '1') {
					positionalCounts[j].ones++;
				}
			}
		}
		let filterChoice = '';
		if (positionalCounts[binaryInputIndex].zeroes > positionalCounts[binaryInputIndex].ones) {
			filterChoice = '0';
		} else if (positionalCounts[binaryInputIndex].ones >= positionalCounts[binaryInputIndex].zeroes) {
			filterChoice = '1';
		}
		filteredArray = filteredArray.filter(binaryNumber => binaryNumber[binaryInputIndex] === filterChoice);
		binaryInputIndex++;
	}
	let co2ScrubRating = '';
	let filteredArray2 = binaryInputArr;
	positionalCounts = [];
	binaryInputIndex = 0;
	while (co2ScrubRating === '') {
		if (filteredArray2.length === 1) {
			co2ScrubRating = filteredArray2[0];
			break;
		}
		const lengthCheckString = filteredArray2[0];
		positionalCounts = [];
		for (let i=0; i<lengthCheckString.length; i++) {
			positionalCounts.push({ zeroes: 0, ones: 0 });
		}
		for (let i=0; i<filteredArray2.length; i++) {
			let currentString = filteredArray2[i];
			for (let j=0; j<positionalCounts.length; j++) {
				if (currentString[j] === '0') {
					positionalCounts[j].zeroes++;
				} else if (currentString[j] === '1') {
					positionalCounts[j].ones++;
				}
			}
		}
		let filterChoice = '';
		if (positionalCounts[binaryInputIndex].zeroes <= positionalCounts[binaryInputIndex].ones) {
			filterChoice = '0';
		} else if (positionalCounts[binaryInputIndex].ones < positionalCounts[binaryInputIndex].zeroes) {
			filterChoice = '1';
		}
		filteredArray2 = filteredArray2.filter(binaryNumber => binaryNumber[binaryInputIndex] === filterChoice);
		binaryInputIndex++;
	}
	let oxygenGenRatingDecimal = parseInt(oxygenGenRating,2);
	let co2ScrubRatingDecimal = parseInt(co2ScrubRating,2);
	console.log("Answer found! \nOxygen Generator Rating: " + oxygenGenRatingDecimal
		+ "\nCO2 Scrubber Rating: " + co2ScrubRatingDecimal
		+ "\n" + oxygenGenRatingDecimal + " * " + co2ScrubRatingDecimal + " = " + (oxygenGenRatingDecimal * co2ScrubRatingDecimal));
})();
