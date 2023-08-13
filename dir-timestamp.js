#!/usr/bin/env node

import { readdirSync, statSync, utimesSync } from 'node:fs';

if (process.argv.length < 3) {
	console.log('Arguments: <directory>...');
	process.exit(1);
}

function recurse(path) {
	const stats = statSync(path);
	if (stats.isFile()) {
		return stats.mtimeMs / 1000;
	}
	if (stats.isDirectory()) {
		const max = readdirSync(path).reduce((max, child) => Math.max(max, recurse(path + '/' + child)), 0);
		if (max === 0) {
			throw new Error(`Empty directory: ${path}`);
		}
		utimesSync(path, max, max);
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
