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

function findMaxDimensions(vectorArray) {
	let maxX = 0;
	let maxY = 0;
	for (const vectorPair of vectorArray) {
		if (vectorPair.x1 > maxX) {
			maxX = vectorPair.x1;
		}
		if (vectorPair.y1 > maxY) {
			maxY = vectorPair.y1;
		}
		if (vectorPair.x2 > maxX) {
			maxX = vectorPair.x2;
		}
		if (vectorPair.y2 > maxY) {
			maxY = vectorPair.y2;
		}
	}
	return { maxX: maxX, maxY: maxY };
}

function initGrid(x, y) {
	let grid = [];
	for (let i=0; i<=y; i++) {
		let currentRow = [];
		for (let j=0; j<=x; j++) {
			currentRow.push('.');
		}
		grid.push(currentRow);
	}
	return grid;
}

function addLine(grid, vector) {
	let startX = vector.x1;
	let startY = vector.y1;
	let endX = vector.x2;
	let endY = vector.y2;
	let cursorX = startX;
	let cursorY = startY;
	console.log("DEBUG: startX = " + startX + ", startY = " + startY);
	console.log("DEBUG: endX = " + endX + ", endY = " + endY);
	console.log("DEBUG: cursorX != endX is " + (cursorX != endX));
	console.log("DEBUG: cursorY != endY is " + (cursorY != endY));
	while (true) {
		console.log("DEBUG: cursorX = " + cursorX + ", cursorY = " + cursorY);
		let row = grid[cursorY];
		let currentValue = row[cursorX];
		if (currentValue === '.') {
			grid[cursorY][cursorX] = 1;
		} else {
			grid[cursorY][cursorX]++;
		}
		if (cursorX === endX && cursorY === endY) {
			break;
		}
		console.log("DEBUG: cursorX != endX is " + (cursorX != endX));
		if (cursorX != endX && cursorX > endX) {
			cursorX--;
		} else if (cursorX != endX && cursorX < endX) {
			cursorX++;
		}
		console.log("DEBUG: cursorY != endY is " + (cursorY != endY));
		if (cursorY != endY && cursorY > endY) {
			cursorY--;
		} else if (cursorY != endY && cursorY < endY) {
			cursorY++;
		}
	}
}

function getPoints(grid) {
	let points = 0;
	for (const row of grid) {
		for (const value of row) {
			if (value > 1) {
				points++;
			}
		}
	}
	return points;
}

function isDiagonal(vector) {
	return ((vector.x1 != vector.x2) && (vector.y1 != vector.y2));
}

(async function mainExecution() {
	await openFileForReading('input.txt');
	let vectorArray = inputArr.map(e => {
		let regex = /(\d+),(\d+) -> (\d+),(\d+)/;
		let found = e.match(regex);
		return { x1: parseInt(found[1]), y1: parseInt(found[2]),
			x2: parseInt(found[3]), y2: parseInt(found[4])
		};
	});
	gridDimensions = findMaxDimensions(vectorArray);
	let grid = initGrid(gridDimensions.maxX, gridDimensions.maxY);
	console.log(grid.map(e => e.join('')).join('\n'));
	for (const vector of vectorArray) {
		console.log("DEBUG: Operating on vector " + vector.x1 + ","
			+ vector.y1 + " -> " + vector.x2 + "," + vector.y2);
		addLine(grid, vector);
		console.log(grid.map(e => e.join('')).join('\n'));
	}
	console.log("Answer found! " + getPoints(grid));
})();
