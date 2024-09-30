import { parseSync } from '@babel/core';
import codeshift from 'jscodeshift';

// TODO: Merge with parse-module

export function parseBabel(srcCode) {
	return parseSync(srcCode, {
		plugins: [
			['@babel/plugin-transform-typescript', { allowDeclareFields: true }],
			['@babel/plugin-proposal-decorators', { legacy: true }],
			'@babel/plugin-transform-class-properties',
			'@babel/plugin-transform-private-methods',
		],
		parserOpts: {
			tokens: true, // recast uses this
		},
	});
}

export function codeshiftBabel(srcCode) {
	return codeshift.withParser({
		parse: parseBabel,
	})(srcCode);
}
