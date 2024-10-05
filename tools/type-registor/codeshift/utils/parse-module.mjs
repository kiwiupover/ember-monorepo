import codeshift from 'jscodeshift';
import fs from 'node:fs';

import { memoSimpleFn } from './memoize.mjs';
import { nicePath } from './path.mjs';

export function parseModuleFresh(filePath) {
	try {
		const fileContents = fs.readFileSync(filePath, { encoding: 'utf-8' });
		const isTypescript = filePath.endsWith('.ts');
		return isTypescript ? codeshift.withParser('ts')(fileContents) : codeshift(fileContents);
	} catch (e) {
		console.log(`${nicePath(filePath)} is not compatible with jscodeshift\n\t`, e.message);
		return null;
	}
}

/**
 * parse the contents of the file at the given filePath into an AST
 *
 * this method memoizes, calls using the same filePath will return
 * the same AST.
 *
 *
 * @function parseModule
 * @param {String} filePath
 * @returns {AST|null} a jscodeshift AST, null if the file cannot be parsed
 */
export const parseModule = memoSimpleFn(parseModuleFresh);
