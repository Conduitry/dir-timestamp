#!/usr/bin/env node

import { readdirSync, statSync, utimesSync } from 'node:fs';

if (process.argv.length < 3) {
	console.log('Arguments: <directory>...');
	process.exit(1);
}

function recurse(path) {
	const stats = statSync(path);
	if (stats.isFile()) {
		return stats.mtimeMs;
	}
	if (stats.isDirectory()) {
		let max = 0;
		readdirSync(path).forEach(child => {
			max = Math.max(max, recurse(path + '/' + child));
		});
		if (max === 0) {
			throw new Error(`Empty directory: ${path}`);
		}
		utimesSync(path, max / 1000, max / 1000);
		return max;
	}
	throw new Error(`Unexpected type: ${path}`);
}

let had_errors = false;

for (const dir of process.argv.slice(2)) {
	try {
		recurse(dir.replace(/\/$/, ''));
		console.log(`Done: ${dir}`);
	} catch (err) {
		console.log(`${err.message}\nAborting: ${dir}`);
		had_errors = true;
	}
}

if (had_errors) {
	process.exit(1);
}
