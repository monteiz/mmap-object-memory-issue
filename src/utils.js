const fs = require("fs");

const units = ["bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
let start = process.hrtime();

module.exports = {
	getFormattedBytes: (bytes) => {
		let l = 0,
			n = parseInt(bytes, 10) || 0;

		while (n >= 1024 && ++l) {
			n = n / 1024;
		}

		const formattedBytes = n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l];

		return formattedBytes;
	},
	printElapsedTime: (note) => {
		var precision = 3; // 3 decimal places
		var elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
		console.log(process.hrtime(start)[0] + " s, " + elapsed.toFixed(precision) + " ms - " + note); // print message + time
		start = process.hrtime(); // reset the timer
	},
	countFileLines: (filePath) => {
		return new Promise((resolve, reject) => {
			let lineCount = 0;
			fs.createReadStream(filePath)
				.on("data", (buffer) => {
					let idx = -1;
					lineCount--; // Because the loop will run once for idx=-1
					do {
						idx = buffer.indexOf(10, idx + 1);
						lineCount++;
					} while (idx !== -1);
				})
				.on("end", () => {
					resolve(lineCount);
				})
				.on("error", reject);
		});
	},
};
