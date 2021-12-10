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
	for (const char of line) {
		let compare = undefined;
		switch (char) {
			case '(': stack.push(char); break;
			case '[': stack.push(char); break;
			case '{': stack.push(char); break;
			case '<': stack.push(char); break;
			case ')': compare = stack.pop();
				if (compare != '(') {
					return { corrupted: true, violationCharacter: char };
				}
				break;
			case ']': compare = stack.pop();
				if (compare != '[') {
					return { corrupted: true, violationCharacter: char };
				}
				break;
			case '}': compare = stack.pop();
				if (compare != '{') {
					return { corrupted: true, violationCharacter: char };
				}
				break;
			case '>': compare = stack.pop();
				if (compare != '<') {
					return { corrupted: true, violationCharacter: char };
				}
				break;
		}
	}
	return { corrupted: false, violationCharacter: undefined };
}

(async function mainExecution() {
	await openFileForReading('input.txt');
	let totalSum = 0;
	for (const line of inputArr) {
		let lineResult = analyzeLine(line);
		console.log(lineResult);
		if (lineResult.corrupted === true) {
			let lineScore = 0;
			console.log(lineResult.violationCharacter);
			switch (lineResult.violationCharacter) {
				case ')': lineScore = 3;
					console.log("DEBUG: ) detected");
					break;
				case ']': lineScore = 57;
					console.log("DEBUG: ] detected");
					break;
				case '}': lineScore = 1197;
					console.log("DEBUG: } detected");
					break;
				case '>': lineScore = 25137;
					console.log("DEBUG: > detected");
					break;
			}
			console.log("DEBUG: Adding " + lineScore + " to " + totalSum);
			totalSum += lineScore;
		}
	}
	console.log("Answer found! " + totalSum);
})();
