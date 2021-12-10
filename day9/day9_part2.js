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

function findNeighbors(x,y) {
	let neighbors = [];
	let rowBoundary = inputArr.length-1;
	let colBoundary = inputArr[0].length-1;
	if (x-1 >= 0) {
		neighbors.push({ x: x-1, y: y });
	}
	if (x+1 <= colBoundary) {
		neighbors.push({ x: x+1, y: y });
	}
	if (y-1 >= 0) {
		neighbors.push({ x: x, y: y-1 });
	}
	if (y+1 <= rowBoundary) {
		neighbors.push({ x: x, y: y+1 });
	}
	return neighbors;
}

function isLowPoint(x,y) {
	let neighbors = findNeighbors(x,y);
	let myValue = inputArr[y][x];
	let isLow = true;
	for (const neighbor of neighbors) {
		let theirValue = inputArr[neighbor.y][neighbor.x];
		if (parseInt(theirValue) <= parseInt(myValue)) {
			isLow = false;
			break;
		}
	}
	return isLow;
}

function findBasin(startPoint){
	let eligibleTiles = [ startPoint ];
	let basin = [];
	while (eligibleTiles.length > 0) {
		let currentTile = eligibleTiles.pop();
		basin.push(currentTile);
		let currentNeighbors = findNeighbors(currentTile.x,currentTile.y);
		for (const neighbor of currentNeighbors) {
			let theirValue = parseInt(inputArr[neighbor.y][neighbor.x]);
			if (basin.filter(e => (e.x === neighbor.x && e.y === neighbor.y)).length === 0
					&& eligibleTiles.filter(e => (e.x === neighbor.x && e.y === neighbor.y)).length === 0
					&& !(theirValue === 9)) {
				eligibleTiles.push(neighbor);
			}
		}
	}
	console.log("DEBUG: returning basin = " + basin.map(e => e.x + "," + e.y).join(';'));
	return basin;
}

(async function mainExecution() {
	await openFileForReading('input.txt');
	let lowPoints = [];
	let basins = [];
	for (let y = 0; y < inputArr.length; y++) {
		let currentRow = inputArr[y];
		for (let x = 0; x < currentRow.length; x++) {
			if (isLowPoint(x,y)) {
				console.log("DEBUG: Found a low point! " + x + "," + y + " -- value: " + currentRow[x]);
				lowPoints.push({ x: x, y: y });
			}
		}
	}
	for (const lowPoint of lowPoints) {
		basins.push(findBasin(lowPoint));
	}
	console.log(basins.map(e => e.length).sort((a,b) => { return b - a }));
	console.log("Answer found! " + basins.map(e => e.length).sort((a,b) => { return b - a }).slice(0,3).reduce((a,b) => a * b));
})();
