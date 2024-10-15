import codeshift from 'jscodeshift';

export function ensureParentIsDefaultExport(code, path, token, filePath) {
	if (!path.parent) {
		throw new Error(`no parent`);
	}
	let parent = path;
	let lastParent = path;
	let topMostDeclaration;
	while ((parent = parent.parent)) {
		if (parent.value.type === 'ExportDefaultDeclaration') {
			return true;
		} else if (parent.value.type === 'ClassDeclaration') {
			lastParent = parent;
			continue;
		} else if (parent.value.type === 'Program' || parent.parent.value.type === 'Program') {
			topMostDeclaration = lastParent;
			break;
		}
		lastParent = parent;
	}

	if (topMostDeclaration) {
		let DefaultExport;
		try {
			DefaultExport = code.find(codeshift.ExportDefaultDeclaration).get();
			if (
				DefaultExport.value.declaration &&
				DefaultExport.value.declaration.type === 'ClassDeclaration' &&
				DefaultExport.value.declaration.superClass &&
				DefaultExport.value.declaration.superClass.name === topMostDeclaration.value.id.name
			) {
				return true;
			} else if (
				DefaultExport.value.declaration &&
				DefaultExport.value.declaration.type === 'Identifier' &&
				DefaultExport.value.declaration.name === topMostDeclaration.value.id.name
			) {
				return true;
			}
		} catch (e) {
			console.log({ originalError: e });
			console.log({ topMostDeclaration });
			console.log({ parent: topMostDeclaration.parent });
			throw new Error(`Unable to determine if default export is the top-most-declaration in ${filePath}`);
		}
	}
	throw new Error(`Found usage of ${token} not within a default export in ${filePath}`);
}
