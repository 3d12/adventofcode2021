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

function analyzeLine(line) {
	console.log("DEBUG: analyzing line " + line);
	let stack = [];
	let completionSequence = [];
	for (const char of line) {
		let compare = undefined;
		switch (char) {
			case '(': stack.push(char); break;
			case '[': stack.push(char); break;
			case '{': stack.push(char); break;
			case '<': stack.push(char); break;
			case ')': compare = stack.pop();
				if (compare != '(') {
					return { corrupted: true, violationCharacter: char, completionSequence: undefined };
				}
				break;
			case ']': compare = stack.pop();
				if (compare != '[') {
					return { corrupted: true, violationCharacter: char, completionSequence: undefined };
				}
				break;
			case '}': compare = stack.pop();
				if (compare != '{') {
					return { corrupted: true, violationCharacter: char, completionSequence: undefined };
				}
				break;
			case '>': compare = stack.pop();
				if (compare != '<') {
					return { corrupted: true, violationCharacter: char, completionSequence: undefined };
				}
				break;
		}
	}
	if (stack.length > 0) {
		while (stack.length > 0) {
			let currentOpening = stack.pop();
			switch (currentOpening) {
				case '(': completionSequence.push(')'); break;
				case '[': completionSequence.push(']'); break;
				case '{': completionSequence.push('}'); break;
				case '<': completionSequence.push('>'); break;
			}
		}
		return { corrupted: false, violationCharacter: undefined, completionSequence: completionSequence };
	} else {
			return { corrupted: false, violationCharacter: undefined, completionSequence: undefined };
	}
}

(async function mainExecution() {
	await openFileForReading('input.txt');
	let lineScores = [];
	for (const line of inputArr) {
		let lineResult = analyzeLine(line);
		console.log(lineResult);
		if (lineResult.corrupted === false) {
			let lineScore = 0;
			for (const char of lineResult.completionSequence) {
				lineScore *= 5;
				let charValue = 0;
				switch (char) {
					case ')': charValue = 1; break;
					case ']': charValue = 2; break;
					case '}': charValue = 3; break;
					case '>': charValue = 4; break;
				}
				lineScore += charValue;
			}
			console.log("DEBUG: Line complete! lineScore = " + lineScore);
			lineScores.push(lineScore);
		}
	}
	console.log(lineScores);
	console.log("Answer found! " + lineScores.sort((a,b) => { return a - b })[Math.floor((lineScores.length - 1) / 2)]);
})();
