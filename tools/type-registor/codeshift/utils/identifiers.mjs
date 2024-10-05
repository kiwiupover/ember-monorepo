import codeshift from 'jscodeshift';

import { isIdentifierTypeNode } from './typescript.mjs';

export function getIdentifierDeclaration(code, filePath, identifierName) {
	const collection = code
		.find(codeshift.Identifier, { name: identifierName })
		.filter((node) => !isIdentifierTypeNode(node));

	if (!collection.length) {
		throw new Error(`Expected to find ${identifierName} in ${filePath}`);
	}

	let declaration = collection.get();
	if (declaration.parent.value.type === 'VariableDeclarator') {
		declaration = declaration.parent.value.init;
		if (!declaration) {
			console.log(collection.get());
			throw new Error(`Expected a declaration for ${identifierName} in ${filePath}`);
		}
	}

	return declaration;
}
