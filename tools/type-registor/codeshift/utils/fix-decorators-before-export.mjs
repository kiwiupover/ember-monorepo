const EXPR = /@([a-zA-Z]+)(\([^)]+\))?\nexport default class ([a-zA-Z0-9]+) /;

export function fixDecorators(str) {
	if (EXPR.test(str)) {
		const matches = str.match(EXPR);
		const className = matches[matches.length - 1];
		str = str.replace('export default class ', 'class ');
		str = str + `\n\nexport default ${className};\n`;
		return str;
	}
	return str;
}
