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

function findNeighbors(x,y,octopusGrid) {
	let neighbors = [];
	let rowBoundary = octopusGrid.length-1;
	let colBoundary = octopusGrid[0].length-1;
	// left
	if (x-1 >= 0) {
		neighbors.push({ x: x-1, y: y });
	}
	// right
	if (x+1 <= colBoundary) {
		neighbors.push({ x: x+1, y: y });
	}
	// up
	if (y-1 >= 0) {
		neighbors.push({ x: x, y: y-1 });
	}
	// down
	if (y+1 <= rowBoundary) {
		neighbors.push({ x: x, y: y+1 });
	}
	// up-left
	if (x-1 >= 0 && y-1 >= 0) {
		neighbors.push({ x: x-1, y: y-1 });
	}
	// up-right
	if (x+1 <= colBoundary && y-1 >= 0) {
		neighbors.push({ x: x+1, y: y-1 });
	}
	// down-left
	if (x-1 >= 0 && y+1 <= rowBoundary) {
		neighbors.push({ x: x-1, y: y+1 });
	}
	// down-right
	if (x+1 <= colBoundary && y+1 <= rowBoundary) {
		neighbors.push({ x: x+1, y: y+1 });
	}
	return neighbors;
}

function simulateStep(octopusGrid) {
	let flashedThisStep = [];
	let newGrid = [];
	// serialize into objects
	for (let y = 0; y < octopusGrid.length; y++) {
		let currentRow = octopusGrid[y];
		let newRow = [];
		for (let x = 0; x < currentRow.length; x++) {
			newRow.push({ numericValue: octopusGrid[y][x] });
		}
		newGrid.push(newRow);
	}
	// increment every octopus' value by 1
	for (let y = 0; y < newGrid.length; y++) {
		let currentRow = newGrid[y];
		for (let x = 0; x < currentRow.length; x++) {
			newGrid[y][x].numericValue++;
		}
	}
	// check for flashes
	for (let y = 0; y < newGrid.length; y++) {
		let currentRow = newGrid[y];
		for (let x = 0; x < currentRow.length; x++) {
			let currentOctopus = currentRow[x];
			// on flash, if not already flashed this step
			if (currentOctopus.numericValue > 9 && flashedThisStep.filter(e => e.x === x && e.y === y).length === 0) {
				let flashesToResolve = [ { x: x, y: y } ];
				while (flashesToResolve.length > 0) {
					//console.log("DEBUG: flashesToResolve = " + flashesToResolve.map(e => e.x + ',' + e.y).join(';'));
					let resolvingFlash = flashesToResolve.pop();
					//console.log("DEBUG: " + resolvingFlash.x + "," + resolvingFlash.y + " (" + newGrid[resolvingFlash.y][resolvingFlash.x].numericValue + ") flashed");
					// add to flashedThisStep
					flashedThisStep.push({ x: resolvingFlash.x, y: resolvingFlash.y });
					let neighbors = findNeighbors(resolvingFlash.x,resolvingFlash.y,newGrid);
					//console.log("DEBUG: neighbors: " + neighbors.map(e => e.x + "," + e.y).join(';'));
					// increase all neighbors
					for (const neighbor of neighbors) {
						//console.log("DEBUG: increasing neighbor " + neighbor.x + "," + neighbor.y + " (" + newGrid[neighbor.y][neighbor.x].numericValue + ") -> (" + (newGrid[neighbor.y][neighbor.x].numericValue + 1) + ")");
						newGrid[neighbor.y][neighbor.x].numericValue++;
						// check for flashes
						if (newGrid[neighbor.y][neighbor.x].numericValue > 9
								&& flashedThisStep.filter(e => e.x === neighbor.x && e.y === neighbor.y).length === 0
								&& flashesToResolve.filter(e => e.x === neighbor.x && e.y === neighbor.y).length === 0) {
							//console.log("DEBUG: adding " + neighbor.x + "," + neighbor.y + " to flashesToResolve");
							// add to flashesToResolve
							flashesToResolve.push(neighbor);
						}
					}
				}
			}
		}
	}
	// all flashed octopi have their energy reset
	for (const flashed of flashedThisStep) {
		newGrid[flashed.y][flashed.x].numericValue = 0;
	}
	return { updatedGrid: newGrid.map(e => e.map(f => f.numericValue)), flashedThisStep: flashedThisStep };
}

(async function mainExecution() {
	await openFileForReading('input.txt');
	let octopusArr = [];
	let totalFlashes = 0;
	for (const line of inputArr) {
		let tempLine = [];
		for (const char of line) {
			tempLine.push(parseInt(char));
		}
		octopusArr.push(tempLine);
	}
	//console.log(octopusArr.map(e => e.join('')).join('\n'));
	console.log("DEBUG: start of step 1: ");
	console.log(octopusArr.map(e => e.join('')).join('\n'));
	console.log("DEBUG: totalFlashes = " + totalFlashes);
	let updatedArr = simulateStep(octopusArr);
	totalFlashes += updatedArr.flashedThisStep.length;
	console.log("DEBUG: end of step 1: ");
	console.log(updatedArr.updatedGrid.map(e => e.join('')).join('\n'));
	console.log("DEBUG: totalFlashes = " + totalFlashes);
	for (let i = 0; i < 99; i++) {
		console.log("DEBUG: start of step " + (i+2) + ": ");
		console.log(updatedArr.updatedGrid.map(e => e.join('')).join('\n'));
		console.log("DEBUG: totalFlashes = " + totalFlashes);
		updatedArr = simulateStep(updatedArr.updatedGrid);
		totalFlashes += updatedArr.flashedThisStep.length;
		console.log("DEBUG: end of step " + (i+2) + ": ");
		console.log(updatedArr.updatedGrid.map(e => e.join('')).join('\n'));
		console.log("DEBUG: totalFlashes = " + totalFlashes);
	}
})();
