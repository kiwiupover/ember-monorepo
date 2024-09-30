import { ensureParentIsDefaultExport } from './ensure-parent-is-default-export.mjs';

const COMPUTEDS = [
	'computed',
	'or',
	'alias',
	'mapBy',
	'uniq',
	'reads',
	'lte',
	'lt',
	'gte',
	'gt',
	'equal',
	'and',
	'filterBy',
	'setDiff',
];
const LITERALS = ['Literal', 'StringLiteral'];
function checkDependentKeysOfComputeds(code, propertyName /*, filePath*/) {
	let usesProperty = false;
	code.find('Property').forEach((path) => {
		const node = path.value;
		if (node.value.type === 'CallExpression') {
			const { callee, arguments: args } = node.value;

			if (
				(callee.type === 'MemberExpression' && callee.object.name === 'computed') ||
				(callee.type === 'Identifier' && COMPUTEDS.includes(callee.name))
			) {
				const found = args.some((arg) => {
					return (
						LITERALS.includes(arg.type) &&
						typeof arg.value === 'string' &&
						(arg.value === propertyName || arg.value.startsWith(`${propertyName}.`))
					);
				});
				if (found) {
					usesProperty = true;
				}
			}
		}
	});

	return usesProperty;
}

function isGetOrSetCall(node) {
	return (
		((node.callee.name === 'get' && node.arguments.length === 2) ||
			(node.callee.name === 'set' && node.arguments.length === 3)) &&
		node.arguments[0].type === 'ThisExpression' &&
		LITERALS.includes(node.arguments[1].type)
	);
}

function isGetOrSetMemberCall(path) {
	const numArgs = path.parent.node.arguments.length;
	return (
		((path.node.property.name === 'get' && numArgs === 1) || (path.node.property.name === 'set' && numArgs === 2)) &&
		LITERALS.includes(path.parent.node.arguments[0].type)
	);
}

export function detectPropertyUsageInDefaultExport(code, propertyName, filePath) {
	let found = false;

	// get(this, <prop>)
	code.find('CallExpression').forEach((path) => {
		if (path.node.callee.type === 'Identifier' && isGetOrSetCall(path.node)) {
			const { value } = path.node.arguments[1];

			if (
				(value === propertyName || value.startsWith(`${propertyName}.`)) &&
				ensureParentIsDefaultExport(code, path, propertyName, filePath)
			) {
				found = true;
				return true;
			}
		}
	});

	if (found) {
		return true;
	}

	// this.get(<prop>) | this.<prop>
	code.find('MemberExpression').forEach((path) => {
		if (
			path.node.object.type === 'ThisExpression' &&
			path.node.property.name === propertyName &&
			ensureParentIsDefaultExport(code, path, propertyName, filePath)
		) {
			found = true;
			return true;
		} else if (
			path.node.object.type === 'ThisExpression' &&
			path.parent.node.type === 'CallExpression' &&
			isGetOrSetMemberCall(path)
		) {
			const { value } = path.parent.node.arguments[0];
			if (
				(value === propertyName || value.startsWith(`${propertyName}.`)) &&
				ensureParentIsDefaultExport(code, path, propertyName, filePath)
			) {
				found = true;
				return true;
			}
		}
	});

	if (found) {
		return true;
	}

	// const { prop } = this;
	code.find('VariableDeclarator').forEach((path) => {
		if (
			path.node.id.type === 'ObjectPattern' &&
			path.node.init &&
			path.node.init.type === 'ThisExpression' &&
			path.node.id.properties.some((v) => v.key.name === propertyName) &&
			ensureParentIsDefaultExport(code, path, propertyName, filePath)
		) {
			found = true;
			return true;
		}
	});

	if (found) {
		return true;
	}

	// check for computed.or("auth.<>") etc.
	return checkDependentKeysOfComputeds(code, propertyName, filePath);
}
