 
import codeshift from 'jscodeshift';

function isServiceDecorator(infos, decorator) {
	const name = decorator.name || decorator.expression?.name || decorator.expression?.callee?.name;
	if (name !== 'service' && name !== infos.importedLocalInjectionName) {
		return false;
	}
	return true;
}

export function addInjectionToDefaultExport(code, tokenName, serviceName, infos, filePath) {
	const DefaultExport = code.find(codeshift.ExportDefaultDeclaration).get();
	let { declaration } = DefaultExport.value;
	if (!declaration) {
		throw new Error(`Expected a default export`);
	}

	if (declaration.type === 'Identifier') {
		const program = code.find('Program').get();
		for (let i = 0; i < program.value.body.length; i++) {
			const node = program.value.body[i];
			if (node.type === 'VariableDeclaration') {
				const decl = node.declarations.find(
					(decl) => decl.id.type === 'Identifier' && decl.id.name === declaration.name,
				);
				if (decl) {
					declaration = decl.init;
					break;
				}
			} else if (node.type === 'ClassDeclaration' && node.id.name === declaration.name) {
				declaration = node;
				break;
			}
		}
	}

	if (declaration.type === 'ClassDeclaration') {
		const { body } = declaration.body;
		const found = body.some((v) => {
			if (v.type === 'ClassProperty' && v.key.name === tokenName) {
				if (v.decorators && v.decorators.length === 1 && isServiceDecorator(infos, v.decorators[0])) {
					return true;
				}
				throw new Error(`Unexpected dual definition for ${tokenName} in ${filePath}`);
			}
			return false;
		});

		if (found) {
			return false;
		}

		const newProp = codeshift.classProperty(codeshift.identifier(tokenName), null);
		delete newProp.value;
		newProp.decorators = [
			codeshift.decorator(
				tokenName !== serviceName
					? codeshift.callExpression(codeshift.identifier('service'), [codeshift.stringLiteral(serviceName)])
					: codeshift.identifier('service'),
			),
		];
		body.unshift(newProp);
	} else if (declaration.type === 'CallExpression') {
		const body = declaration.arguments.find((arg) => arg.type === 'ObjectExpression');
		if (!body) {
			throw new Error(`Unable to find class body`);
		}

		const found = body.properties.some((v) => {
			if (v.type === 'Property' && v.key.name === tokenName) {
				if (v.value && v.value.callee && isServiceDecorator(infos, v.value.callee)) {
					return true;
				}
				throw new Error(`Unexpected dual definition for ${tokenName} in ${filePath}`);
			}
			return false;
		});

		if (found) {
			return false;
		}

		body.properties.unshift(
			codeshift.property(
				'init',
				codeshift.identifier(tokenName),
				codeshift.callExpression(
					codeshift.identifier('service'),
					tokenName === serviceName ? [] : [codeshift.stringLiteral(serviceName)],
				),
			),
		);
	} else {
		throw new Error(
			`Unknown type ${declaration.type} for default export. Expected either a classic or native class definition in ${filePath}`,
		);
	}
	return true;
}
