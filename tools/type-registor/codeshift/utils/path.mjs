import path from 'node:path';
import process from 'node:process';

import { getConfig } from './get-config.mjs';
import { memoSimpleFn } from './memoize.mjs';

export const PROJECT = process.cwd();
const CONFIG = getConfig();

export const nicePath = memoSimpleFn(function (absPath) {
	if (typeof absPath !== 'string') {
		throw new Error(`Expected absPath to be a string, got ${absPath}`);
	}
	return path.relative(PROJECT, absPath);
});

export const convertPathToImport = memoSimpleFn(function (filePath) {
	if (typeof filePath !== 'string') {
		throw new Error(`Expected filePath to be a string, got ${filePath}`);
	}
	let shorter = nicePath(filePath);
	shorter = shorter.replace(`${CONFIG.project}/app/`, `${CONFIG.modulePrefix}/`);
	shorter = shorter.replace('.js', '');
	shorter = shorter.replace('.ts', '');

	return shorter;
});
