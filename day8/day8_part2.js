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

class SignalPatternConsole {
	displays = [];

	constructor(signalPatterns) {
		// store signal patterns
		for (const pattern of signalPatterns) {
			this.displays.push({ wires: pattern, numericValue: undefined })
		}

		// compute
		// step 1: identify 1, 4, 7, and 8
		for (let display of this.displays) {
			if (display.wires.length === 2) {
				display.numericValue = 1;
			}
			if (display.wires.length === 3) {
				display.numericValue = 7;
			}
			if (display.wires.length === 4) {
				display.numericValue = 4;
			}
			if (display.wires.length === 7) {
				display.numericValue = 8;
			}
		}

		// step 2: identify the top segment
		let one = this.displays.filter(e => e.numericValue === 1)[0];
		let seven = this.displays.filter(e => e.numericValue === 7)[0];
		let topSegment = 'x';
		for (const segment of seven.wires) {
			if (!one.wires.includes(segment)) {
				topSegment = segment;
			}
		}

		// step 3: determine which is zero based on the middle (found from
		//		the difference between 4 and 1)
		let four = this.displays.filter(e => e.numericValue === 4)[0];
		let middleSegment = 'x';
		let possibleMiddle = [];
		for (const segment of four.wires) {
			if (!one.wires.includes(segment)) {
				possibleMiddle.push(segment);
			}
		}
		let sixSegmentClub = this.displays.filter(e => e.wires.length === 6);
		for (let member of sixSegmentClub) {
			for (const possibility of possibleMiddle) {
				if (!member.wires.includes(possibility)){
					member.numericValue = 0;
				}
			}
		}
		let zero = this.displays.filter(e => e.numericValue === 0)[0];

		// step 4: determining six based on missing one value from four
		sixSegmentClub = this.displays.filter(e => e.numericValue === undefined && e.wires.length === 6);
		for (let member of sixSegmentClub) {
			let matches = 0;
			for (const wire of four.wires) {
				if (member.wires.includes(wire)) {
					matches++;
				}
			}
			if (matches === 3) {
				member.numericValue = 6;
			}
		}
		let six = this.displays.filter(e => e.numericValue === 6)[0];

		// step 5: (freebie) nine is the last six-segment number
		let nine = this.displays.filter(e => e.numericValue === undefined && e.wires.length === 6)[0];
		nine.numericValue = 9;

		// step 6: match 2 based on only having 2 segments from 4
		let fiveSegmentClub = this.displays.filter(e => e.numericValue === undefined && e.wires.length === 5);
		for (let member of fiveSegmentClub) {
			let matches = 0;
			for (const wire of four.wires) {
				if (member.wires.includes(wire)) {
					matches++;
				}
			}
			if (matches === 2) {
				member.numericValue = 2;
			}
		}
		let two = this.displays.filter(e => e.numericValue === 2)[0];

		// step 7: match 5 based on only having one segment from 1
		fiveSegmentClub = this.displays.filter(e => e.numericValue === undefined && e.wires.length === 5);
		for (let member of fiveSegmentClub) {
			let matches = 0;
			for (const wire of one.wires) {
				if (member.wires.includes(wire)) {
					matches++;
				}
			}
			if (matches === 1) {
				member.numericValue = 5;
			}
		}
		let five = this.displays.filter(e => e.numericValue === 5)[0];

		// step 8: last unassigned value is 3
		let three = this.displays.filter(e => e.numericValue === undefined)[0];
		three.numericValue = 3;

	}

	translationArray() {
		let toReturn = [];
		for (const display of this.displays) {
			toReturn.push({ wires: display.wires, numericValue: display.numericValue });
		}
		return toReturn;
	}
}

(async function mainExecution() {
	await openFileForReading('input.txt');
	let totalSum = 0;
	for (const line of inputArr) {
		let parsed = parseNumbers(line);
		let cons = new SignalPatternConsole(parsed.signalPatterns);
		let translation = cons.translationArray();
		let values = parsed.outputValues;
		let currentNumber = [];
		for (const value of values) {
			let searchList = translation.filter(e => (e.wires.length === value.length));
			for (const wire of value) {
				searchList = searchList.filter(e => (e.wires.includes(wire)));
				if (searchList.length === 1) {
					currentNumber.push(searchList[0].numericValue);
					break;
				}
			}
		}
		console.log("DEBUG: Adding " + parseInt(currentNumber.join('')) + " to " + totalSum);
		totalSum += parseInt(currentNumber.join(''));
	}

	console.log("Answer found! " + totalSum);
})();
