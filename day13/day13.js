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

function parseGrid(input) {
	let gridPoints = [];
	for (const line of input) {
		let regex = /(\d+),(\d+)/;
		let found = line.match(regex);
		if (found) {
			let pointX = parseInt(found[1]);
			let pointY = parseInt(found[2]);
			gridPoints.push({ x: pointX, y: pointY });
		}
	}
	let foldInstructions = [];
	for (const line of input) {
		let regex = /fold along ([x|y])=(\d+)/;
		let found = line.match(regex);
		if (found) {
			let foldDirection = found[1];
			let foldDistance = parseInt(found[2]);
			foldInstructions.push({ direction: foldDirection, distance: foldDistance });
		}
	}
	return { gridPoints: gridPoints, foldInstructions: foldInstructions };
}

function mapGrid(input) {
	let output = [];
	console.log("DEBUG: input.map(e => e.x) = " + input.map(e => e.x).sort((a,b) => b-a)[0]);
	let length = input.map(e => e.x).sort((a,b) => b-a)[0];
	let depth = input.map(e => e.y).sort((a,b) => b-a)[0];
	console.log("DEBUG: length = " + length + ", depth = " + depth);
	for (let y = 0; y <= depth; y++) {
		let currentLine = [];
		for (let x = 0; x <= length; x++) {
			if (input.filter(e => e.x === x).filter(e => e.y === y).length > 0) {
				currentLine.push('#');
			} else {
				currentLine.push('.');
			}
		}
		output.push(currentLine);
	}
	return output;
}

function foldGrid(input,direction,distance) {
	let output = [];
	if (direction === 'x') {
		let inputCopy = input.map(e => e);
		for (let row of inputCopy) {
			row[distance] = '|';
		}
		console.log(inputCopy.map(e => e.join('')).join('\n'));
		for (let row of inputCopy) {
			let newRow = [];
			for (let i = 0; i < distance; i++) {
				let char1 = row[i];
				let char2 = row[i+((distance-i)*2)];
				if (char1 === '#' || char2 === '#') {
					newRow.push('#');
				} else {
					newRow.push('.');
				}
			}
			output.push(newRow);
		}
	} else if (direction === 'y') {
		let foldRow = [];
		for (let i = 0; i<input[distance].length; i++) {
			foldRow.push('-');
		}
		let inputCopy = input.map(e => e);
		inputCopy[distance] = foldRow;
		console.log(inputCopy.map(e => e.join('')).join('\n'));
		for (let i = 0; i < distance; i++) {
			let currentRow = inputCopy[i];
			let compareRow = [];
			let distanceOffset = i+((distance-i)*2);
			if (distanceOffset < inputCopy.length) {
				compareRow = inputCopy[i+((distance-i)*2)];
			} else {
				compareRow = currentRow;
			}
			let newRow = [];
			for (let charIndex = 0; charIndex < currentRow.length; charIndex++) {
				let currentChar = currentRow[charIndex];
				let compareChar = compareRow[charIndex];
				if (currentChar === '#' || compareChar === '#') {
					newRow.push('#');
				} else {
					newRow.push('.');
				}
			}
			output.push(newRow);
		}
	} else {
		return new Exception("Invalid direction passed: " + direction);
	}
	return output;
}

(async function mainExecution() {
	await openFileForReading('input.txt');
	let parsedGrid = parseGrid(inputArr);
	console.log(parsedGrid);
	let fold = 0;
	let foldedMap = mapGrid(parsedGrid.gridPoints);
	console.log("DEBUG: fold = " + fold + ", direction = " + parsedGrid.foldInstructions[0].direction + ", distance = " + parsedGrid.foldInstructions[0].distance);
	console.log(foldedMap.map(e => e.join('')).join('\n'));
	console.log('');
	foldedMap = foldGrid(
	 			foldedMap,
	 			parsedGrid.foldInstructions[0].direction,
	 			parsedGrid.foldInstructions[0].distance
	 		);
	// for (const instruction of parsedGrid.foldInstructions) {
	// 	fold++;
	// 	console.log("DEBUG: fold = " + fold + ", direction = " + instruction.direction + ", distance = " + instruction.distance);
	// 	foldedMap = foldGrid(
	// 			foldedMap,
	// 			instruction.direction,
	// 			instruction.distance
	// 		);
	// 	console.log('');
	// 	console.log(foldedMap.map(e => e.join('')).join('\n'));
	// 	console.log('');
	// }
	let totalDots = foldedMap
		.filter(e => e.includes('#'))
		.map(e => e.filter(f => f === '#').length)
		.reduce((a,b) => a + b);
	console.log("Answer found! " + totalDots);
})();
