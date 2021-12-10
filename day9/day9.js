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

function isLowPoint(x,y) {
	let neighbors = [];
	let rowBoundary = inputArr.length-1;
	let colBoundary = inputArr[0].length-1;
	if (x-1 >= 0) {
		neighbors.push([x-1, y]);
	}
	if (x+1 <= colBoundary) {
		neighbors.push([x+1, y]);
	}
	if (y-1 >= 0) {
		neighbors.push([x, y-1]);
	}
	if (y+1 <= rowBoundary) {
		neighbors.push([x, y+1]);
	}
	let myValue = inputArr[y][x];
	let isLow = true;
	for (const neighbor of neighbors) {
		let theirValue = inputArr[neighbor[1]][neighbor[0]];
		if (parseInt(theirValue) <= parseInt(myValue)) {
			isLow = false;
			break;
		}
	}
	return isLow;
}

(async function mainExecution() {
	await openFileForReading('input.txt');
	let totalSum = 0;
	for (let y = 0; y < inputArr.length; y++) {
		let currentRow = inputArr[y];
		for (let x = 0; x < currentRow.length; x++) {
			if (isLowPoint(x,y)) {
				console.log("DEBUG: Found a low point! " + x + "," + y + " -- value: " + currentRow[x]);
				totalSum += (parseInt(currentRow[x]) + 1);
			}
		}
	}
	console.log("Answer found! " + totalSum);
})();
