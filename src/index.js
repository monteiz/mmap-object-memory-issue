const fs = require("fs");
const readline = require("readline");
const Shared = require("mmap-object");
const { Buffer } = require("buffer");
const { getFormattedBytes, countFileLines } = require("./utils.js");

const loadMasterFile = async (filePath) => {
	if (!fs.existsSync(filePath)) {
		throw `Error while loading master file: ${filePath} not found.`;
	}

	try {
		fs.unlinkSync(`${filePath}.map`);
	} catch (e) {
		//do nothing
	}

	const { size } = fs.statSync(filePath);

	console.log(`Text file size: ${getFormattedBytes(size)}`);

	const sizeInKByte = Math.ceil(size / 1000);

	console.log(`Analysing master ${filePath} on pid ${process.pid}...`);

	const linesCount = await countFileLines(filePath);

	const sharedObject = new Shared.Create(`${filePath}.map`, sizeInKByte * 2, linesCount);

	console.log(`Lines count: ${linesCount}`);

	const fileStream = fs.createReadStream(filePath);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	});

	let lineIndex = 0;

	let totalBytes = 0;

	for await (const line of rl) {
		if (lineIndex % 5000 === 0) {
			process.stdout.clearLine();
			process.stdout.cursorTo(0);
			process.stdout.write(`${lineIndex}`);
		}

		const buffer = Buffer.from(line, "ascii");

		sharedObject[lineIndex] = buffer;

		totalBytes += buffer.length;

		lineIndex++;
	}

	process.stdout.clearLine();
	process.stdout.cursorTo(0);
	console.log(`\nMaster file for ${filePath} successfully analysed.\n`);

	console.log(`Processed byte: ${getFormattedBytes(totalBytes)}`);
	console.log(`RSS: ${getFormattedBytes(process.memoryUsage().rss)}`);
	console.log(`HeapTotal: ${getFormattedBytes(process.memoryUsage().heapTotal)}`);
	console.log(`HeapUsed: ${getFormattedBytes(process.memoryUsage().heapUsed)}`);
	console.log(`External: ${getFormattedBytes(process.memoryUsage().external)}`);
	console.log(`ArrayBuffers: ${getFormattedBytes(process.memoryUsage().arrayBuffers)}`);
};

loadMasterFile(`${process.cwd()}/random_strings.txt`);
