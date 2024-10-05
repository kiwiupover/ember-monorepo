import codeshift from 'jscodeshift';

import { nicePath } from '../path.mjs';

function buildImportSpecifier(local, imported) {
	const isDefaultImport = imported === 'default';
	const localIsImported = local === imported;

	if (isDefaultImport) {
		// we don't currently support renaming a default export
		return codeshift.importDefaultSpecifier(codeshift.identifier(local));
	}

	return localIsImported
		? codeshift.importSpecifier(codeshift.identifier(imported))
		: codeshift.importSpecifier(codeshift.identifier(imported), codeshift.identifier(local));
}

export function ensureImport(code, filePath, importDef) {
	const { local, imported, source } = importDef;
	const decl = getImport(code, filePath, importDef);
	const isDefaultImport = imported === 'default';
	const localIsImported = local === imported;

	if (!decl) {
		code
			.find(codeshift.ImportDeclaration)
			.at(-1)
			.insertAfter(
				codeshift.importDeclaration([buildImportSpecifier(local, imported)], codeshift.stringLiteral(source)),
			);
		return true;
	}

	if (importSatisfies(decl.decl, importDef)) {
		return false;
	}

	if (!isDefaultImport) {
		if (localIsImported) {
			decl.decl.value.specifiers.push(codeshift.importSpecifier(codeshift.identifier(imported)));
		} else {
			decl.decl.value.specifiers.push(
				codeshift.importSpecifier(codeshift.identifier(imported), codeshift.identifier(local)),
			);
		}
		return true;
	}

	// TODO :)
	console.log(filePath);
	console.log(decl.decl);
	throw new Error(`Support for ensuring import specifiers where an import source already exists needs implemented`);
}

export function importSatisfies(decl, importDef) {
	const { local, imported, source } = importDef;
	const isDefaultImport = imported === 'default';
	const localIsImported = local === imported;

	if (decl.value.source.value !== source) {
		return false;
	}

	const { specifiers } = decl.value;

	if (isDefaultImport) {
		return specifiers.some((specifier) => specifier.type === 'ImportDefaultSpecifier');
	}

	if (localIsImported) {
		return specifiers.some((specifier) => {
			return specifier.type === 'ImportSpecifier' && specifier.imported.name === imported;
		});
	}
	// for now we are overly strict here, may consider even erring if local does not match
	return specifiers.some((specifier) => {
		return (
			specifier.type === 'ImportSpecifier' && specifier.imported.name === imported && specifier.local.name === local
		);
	});
}

export function getImport(code, filePath, importDef) {
	const decl = code.find(codeshift.ImportDeclaration).filter((path) => {
		return path.value.source.value === importDef.source;
	});

	if (!decl.length) {
		return null;
	}

	if (decl.length > 1) {
		throw new Error(`Unexpectedly found multiple import statements for ${importDef.source} in ${nicePath(filePath)}`);
	}

	return {
		decl: decl.get(),
	};
}
