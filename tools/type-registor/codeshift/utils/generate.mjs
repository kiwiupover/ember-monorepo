import codeshift from 'jscodeshift';

export function createPrimitive(value) {
	const type = value === null ? 'null' : typeof value;
	switch (type) {
		case 'string':
			return codeshift.stringLiteral(value);
		case 'boolean':
			return codeshift.booleanLiteral(value);
		case 'null':
			return codeshift.nullLiteral();
		default:
			console.log(value);
			throw new Error(`unknown primitive type ${type}`);
	}
}

export function createObject(obj) {
	const properties = [];
	Object.keys(obj).forEach((key) => {
		properties.push(codeshift.property('init', codeshift.identifier(key), createPrimitive(obj[key])));
	});
	return codeshift.objectExpression(properties);
}
