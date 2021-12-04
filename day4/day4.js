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

function parseBingoCard(bingoCardText) {
	let bingoCardArray = [];
	let rows = bingoCardText.split('\n');
	for (const row of rows) {
		let regex = /(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/;
		let found = row.match(regex);
		let rowArray = [found[1],found[2],found[3],found[4],found[5]];
		bingoCardArray.push(rowArray);
	}
	return bingoCardArray;
}

function splitBingoCards() {
	let splitArray = [];
	let currentBingoCardArray = [];
	// skip the first two lines, bingo cards start on line 3
	let bingoCardArray = inputArr.slice(2);
	for (const line of bingoCardArray) {
		// on blank line, reset accumulated line and send for parsing
		if (line.trim().length === 0) {
			splitArray.push(parseBingoCard(currentBingoCardArray.join('\n')));
			currentBingoCardArray = [];
		} else {
			currentBingoCardArray.push(line);
		}
	}
	// flushing the buffer, in case the last line is not newline-terminated
	if (currentBingoCardArray.length != 0) {
		splitArray.push(parseBingoCard(currentBingoCardArray.join('\n')));
	}
	return splitArray;
}

function findBingo(bingoCard, numbersCalled) {
	// look for horizontal bingos
	for (const row of bingoCard) {
		let horizontalBingo = true;
		for (const number of row) {
			if (!numbersCalled.includes(parseInt(number))) {
				horizontalBingo = false;
				break;
			}
		}
		if (horizontalBingo === true) {
			return true;
		}
	}
	// look for vertical bingos
	for (let colIndex = 0; colIndex < bingoCard[0].length; colIndex++) {
		let verticalBingo = true;
		for (const row of bingoCard) {
			if (!numbersCalled.includes(parseInt(row[colIndex]))) {
				verticalBingo = false;
				break;
			}
		}
		if (verticalBingo === true) {
			return true;
		}
	}
	return false;
}

function findBingoScore(bingoCard, numbersCalled) {
	let pointSpaces = [];
	for (const row of bingoCard) {
		for (const num of row) {
			if (!numbersCalled.includes(parseInt(num))) {
				pointSpaces.push(parseInt(num));
			}
		}
	}
	return (pointSpaces.reduce((a,b) => a+b) * numbersCalled[numbersCalled.length-1]);
}

(async function mainExecution() {
	await openFileForReading('input.txt');
	let numbersToCall = inputArr[0].split(',').map(e => parseInt(e));
	console.log("DEBUG: numbersToCall = " + numbersToCall);
	let bingoCardArray = splitBingoCards();
	let numberCalledIndex = 0;
	let numbersCalled = [];
	let winningBoard = [];
	while (winningBoard.length === 0) {
		// call new number
		numberCalledIndex++;
		numbersCalled = numbersToCall.slice(0,numberCalledIndex);

		// check for win
		for (bingoCard of bingoCardArray) {
			if (findBingo(bingoCard,numbersCalled)) {
				winningBoard = bingoCard;
				break;
			}
		}
	}
	console.log("DEBUG: winningBoard =\n" + winningBoard.join('\n'));
	console.log("DEBUG: numbersCalled = " + numbersCalled);
	console.log("Answer found! " + findBingoScore(winningBoard,numbersCalled));
})();
