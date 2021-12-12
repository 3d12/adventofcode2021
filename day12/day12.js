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

function parseCaves(input) {
	let cavesArr = [];
	for (const line of input) {
		let lineRegex = /(\w+)-(\w+)/;
		let found = line.match(lineRegex);
		let dest1 = found[1];
		let dest2 = found[2];
		console.log("DEBUG: line parsed, dest1 = " + dest1 + ", dest2 = " + dest2);
		let findDest1 = cavesArr.filter(e => e.name === dest1);
		if (findDest1.length === 0) {
			let multiplePassThrough = false;
			if (dest1 === dest1.toUpperCase()) {
				multiplePassThrough = true;
			}
			cavesArr.push({ name: dest1, leadsTo: [ dest2 ], multiplePassThrough: multiplePassThrough });
		} else {
			findDest1[0].leadsTo.push(dest2);
		}
		let findDest2 = cavesArr.filter(e => e.name === dest2);
		if (findDest2.length === 0) {
			let multiplePassThrough = false;
			if (dest2 === dest2.toUpperCase()) {
				multiplePassThrough = true;
			}
			cavesArr.push({ name: dest2, leadsTo: [ dest1 ], multiplePassThrough: multiplePassThrough});
		} else {
			findDest2[0].leadsTo.push(dest1);
		}
	}
	return cavesArr;
}

function findPaths(mapArr, startRoom=mapArr.filter(e => e.name === 'start')[0], currentPath=[], pathsArr=[]) {
	console.log("DEBUG: entering findPaths, startRoom is " + startRoom.name + " and currentPath is " + currentPath.map(e => e.name).join(','));
	if (startRoom.name === 'end') {
		console.log("DEBUG: ending findPaths, found end room");
		let tempPath = currentPath.map(e => e);
		tempPath.push(startRoom);
		pathsArr.push(tempPath);
		return pathsArr;
	}
	if (startRoom.name === 'start') {
		console.log("DEBUG: starting findPaths, found start room");
		currentPath.push(startRoom);
	}
	let dests = startRoom.leadsTo;
	let destObjects = [];
	for (const dest of dests) {
		destObjects.push(mapArr.filter(e => e.name === dest)[0]);
	}
	let eligibleDests = destObjects.filter(e => (currentPath.filter(f => e.name === f.name).length === 0) || e.multiplePassThrough === true);
	//console.log("DEBUG: eligible dests: " + eligibleDests.map(e => e.name).join(','));
	for (const dest of eligibleDests) {
		let tempPath = currentPath.map(e => e);
		if (dest.name != 'end') {
			tempPath.push(dest);
		}
		//console.log("DEBUG: about to recurse, startRoom = " + startRoom.name + ", dest = " + dest.name + ", currentPath = " + tempPath.map(e => e.name).join(',') + " and pathsArr = " + pathsArr.map(e => e.map(f => f.name).join(',')).join(';'))
		findPaths(mapArr, dest, tempPath, pathsArr);
	}
	return pathsArr;
}

(async function mainExecution() {
	await openFileForReading('input.txt');
	let cavesArr = parseCaves(inputArr);
	console.log(cavesArr);
	let paths = findPaths(cavesArr);
	console.log(paths);
	console.log(paths.length);
})();
