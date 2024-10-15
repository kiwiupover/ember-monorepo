/* eslint-disable no-undef */
import codeshift from 'jscodeshift';

import { convertImportToPath } from '../files.mjs';
import { nicePath } from '../path.mjs';
import { findImport, removeImport } from './find-definition.mjs';

function findSameFileParentClass(decl, code, filePath) {
	if (!decl.superClass) {
		return decl;
	}
	let maybeDef;
	let originalIdentifier = null;
	if (decl.type === 'ClassDeclaration') {
		if (decl.superClass.type === 'CallExpression') {
			maybeDef = decl.superClass;
			originalIdentifier = null;
		} else {
			maybeDef = findDeclaration(decl.superClass, code, filePath);
			originalIdentifier = maybeDef ? decl.superClass : null;
		}
	} else {
		maybeDef = findDeclaration(klass.callee.object.name, code, filePath);
		originalIdentifier = maybeDef ? klass.callee.object : null;
	}
	if (maybeDef) {
		maybeDef.__originalIdentifier = originalIdentifier;
		const moreDefs = findSameFileParentClass(maybeDef, code, filePath);
		if (Array.isArray(moreDefs)) {
			return [decl, ...moreDefs];
		}
	}
	return maybeDef ? [decl, maybeDef] : decl;
}

export function findDeclaration(identifier, code, filePath) {
	if (identifier.type !== 'Identifier') {
		throw new Error(`Expected to be given an Identifier, received ${identifier.type} in ${filePath}`);
	}
	const program = code.find('Program').get();
	for (let i = 0; i < program.value.body.length; i++) {
		const node = program.value.body[i];
		if (node.type === 'VariableDeclaration') {
			const decl = node.declarations.find((d) => d.id.type === 'Identifier' && d.id.name === identifier.name);
			if (decl) {
				return decl.init;
			}
		} else if (node.type === 'ClassDeclaration' && node.id.name === identifier.name) {
			return node;
		}
	}
	const importDecl = findImport(identifier.name, code, filePath);
	if (!importDecl) {
		throw new Error(`No top-level VariableDeclaration found for ${identifier.name} in ${filePath}`);
	}
	return null;
}

export function getDefaultExport(code, filePath) {
	let DefaultExport;
	if (filePath.endsWith('.ts')) {
		DefaultExport = code
			.find(codeshift.ExportDefaultDeclaration)
			.filter((node) => {
				return node.parent.name === 'program' && node.value.declaration.type !== 'TSInterfaceDeclaration';
			})
			.get();
	} else {
		DefaultExport = code.find(codeshift.ExportDefaultDeclaration).get();
	}

	let { declaration } = DefaultExport.value;
	if (!declaration) {
		throw new Error(`Expected a default export in ${nicePath(filePath)}`);
	}

	let originalIdentifier = null;
	if (declaration.type === 'Identifier') {
		originalIdentifier = declaration;
		const maybeDef = findDeclaration(declaration, code, filePath);
		if (maybeDef) {
			declaration = maybeDef;
		}
	}

	if (declaration.type === 'ClassDeclaration' || declaration.type === 'CallExpression') {
		const klass = findSameFileParentClass(declaration, code, filePath);
		if (Array.isArray(klass)) {
			klass[0].__originalIdentifier = originalIdentifier;
		} else {
			klass.__originalIdentifier = originalIdentifier;
		}
		return klass;
	}

	throw new Error(
		`Unknown type ${declaration.type} for default export in ${nicePath(
			filePath,
		)}. Expected either a classic or native class definition.`,
	);
}

export function getClassBodyForDefaultExport(
	code,
	filePath,
	config = { enforceSingleBody: true, disallowMixins: false },
) {
	const declaration = getDefaultExport(code, filePath);

	return getClassBody(declaration, filePath, config);
}

export function getClassBody(declaration, filePath, config = { enforceSingleBody: true, disallowMixins: false }) {
	if (declaration.type === 'ClassDeclaration') {
		const { body } = declaration.body;
		return body;
	} else if (declaration.type === 'CallExpression') {
		if (config.disallowMixins && declaration.arguments.length > 1) {
			throw new Error(`The class body in ${filePath} has multiple mixins added but none are allowed.`);
		}
		const objectBodies = declaration.arguments.filter((arg) => arg.type === 'ObjectExpression');
		if (config.enforceSingleBody && objectBodies.length > 1) {
			throw new Error(`The class body in ${filePath} has multiple object definitions.`);
		}

		const body = declaration.arguments.find((arg) => arg.type === 'ObjectExpression');
		if (!body) {
			throw new Error(`Unable to find class body for ${nicePath(filePath)}`);
		}

		return body;
	}
	throw new Error(
		`Unknown type ${
			declaration.type
		} for default export. Expected either a classic or native class definition in ${nicePath(filePath)}.`,
	);
}

// Second param also receives modulePath, but we don't use it
export function removeMixin({ code, filePath }, { name }) {
	const declaration = getDefaultExport(code, filePath);

	if (declaration.type === 'ClassDeclaration') {
		throw new Error(`getUsedMixins does not yet support class syntax`);
	} else if (declaration.type === 'CallExpression') {
		const mixins = declaration.arguments.filter((arg) => arg.type !== 'ObjectExpression' && arg.name === name);

		if (!mixins.length) {
			throw new Error(`Mixin ${name} is not used by ${filePath}`);
		}
		if (mixins.length > 1) {
			throw new Error(`Unexpectedly encountered multiple of ${name} used by ${filePath}`);
		}
		const index = declaration.arguments.indexOf(mixins[0]);
		declaration.arguments.splice(index, 1);

		removeImport(name, code, filePath);
	}
}

export function getUsedMixinsForDefaultExport({ code, filePath }) {
	const declaration = getDefaultExport(code, filePath);

	return getUsedMixins(declaration, { code, filePath });
}

export function getUsedMixins(declaration, { code, filePath }) {
	let args;
	const isNative = declaration.type === 'ClassDeclaration';

	if (isNative) {
		if (declaration.superClass.type === 'Identifier') {
			return [];
		} else if (declaration.superClass.type === 'CallExpression') {
			args = declaration.superClass.arguments;
		} else {
			console.log(declaration);
			throw new Error(`getUsedMixins does not yet support class syntax`);
		}
	} else if (declaration.type === 'CallExpression') {
		args = declaration.arguments;
	}

	const mixins = args.filter((arg) => {
		return (
			arg.name !== 'ModelValidator' &&
			arg.name !== 'ModelValidatorFixes' &&
			(isNative || arg.type !== 'ObjectExpression')
		);
	});

	return mixins.map((node) => {
		if (node.type === 'ObjectExpression') {
			return {
				node,
				importLocation: null,
				modulePath: null,
				filePath: null,
				name: null,
			};
		}
		const importLocation = findImport(node.name, code, filePath);
		const mixin = {
			node,
			importLocation,
			modulePath: importLocation ? importLocation.value.source.value : null,
			filePath: null,
			name: node.name,
		};
		const fullPath = convertImportToPath(mixin.modulePath);
		if (fullPath !== mixin.modulePath) {
			mixin.filePath = fullPath;
		}
		return mixin;
	});
}
