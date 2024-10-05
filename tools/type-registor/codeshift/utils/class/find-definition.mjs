 

import codeshift from 'jscodeshift';

/**
 * Finds the top level definition within a module file for a given identifier name.
 *
 * @param identifierName name of an identifier expected to be defined within the module
 * @param shift codeshift instance for the module
 * @returns null if none found, the path for the VariableDeclarator if found.
 */
export function findDefinition(identifierName, shift, prettyFileName) {
	// scan file to see if this is imported or local
	const variables = shift
		.find(codeshift.VariableDeclarator, function (node) {
			return node.id.name === identifierName;
		})
		.filter((path) => {
			// ensure a top level module declaration
			return (
				path.parentPath.name === 'declarations' &&
				path.parentPath.parentPath.value.type === 'VariableDeclaration' &&
				path.parentPath.parentPath.parentPath.name === 'body'
			);
		});
	if (variables.length > 1) {
		throw new Error(
			`Found more than one top-level definition for ${identifierName}, this is likely a bug in ${prettyFileName}`,
		);
	} else if (variables.length === 1) {
		return variables.get();
	} else {
		return null;
	}
}

export function findImport(identifierName, shift, prettyFileName) {
	const imports = shift.find(codeshift.ImportDeclaration, function (node) {
		return node.specifiers.find((specifier) => specifier.local.name === identifierName);
	});
	if (imports.length > 1) {
		throw new Error(
			`Found more than one top-level import definition for ${identifierName}, this is likely a bug in ${prettyFileName}`,
		);
	} else if (imports.length === 1) {
		return imports.get();
	} else {
		return null;
	}
}

export function removeImport(identifierName, code, prettyFileName) {
	const imports = code.find(codeshift.ImportDeclaration, function (node) {
		return node.specifiers.find((specifier) => {
			return specifier.local ? specifier.local.name === identifierName : specifier.imported.name === identifierName;
		});
	});
	if (imports.length > 1) {
		throw new Error(
			`Found more than one top-level import definition for ${identifierName}, this is likely a bug in ${prettyFileName}`,
		);
	} else if (imports.length === 1) {
		const node = imports.get();
		if (node.value.specifiers.length === 1) {
			imports.remove();
		} else {
			const specifier = node.value.specifiers.find((specifier) => specifier.local.name === identifierName);
			const index = node.value.specifiers.indexOf(specifier);
			node.value.specifiers.splice(index, 1);
		}
	}
}
