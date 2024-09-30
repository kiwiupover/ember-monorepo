import codeshift from 'jscodeshift';

import { ensureImport } from './ensure-import.mjs';
import { getDefaultExport } from './get-class-body-for-default-export.mjs';

export function ensureClassicDecorator(code, filePath) {
	const defaultExport = getDefaultExport(code, filePath);

	if (!defaultExportIsNativeClass(defaultExport)) {
		// we do not need to use the classic decorator on a non-native class
		return false;
	}

	let modified = ensureImport(code, filePath, {
		local: 'classic',
		imported: 'default',
		source: 'ember-classic-decorator',
	});

	modified =
		ensureClassDecorator(defaultExport, {
			name: 'classic',
			generate() {
				return codeshift.identifier('classic');
			},
		}) || modified;

	return modified;
}

export function ensureClassDecorator(klass, config) {
	klass.decorators = klass.decorators || [];
	const existing = klass.decorators.find((v) => v.expression.name === config.name);
	if (!existing) {
		klass.decorators.push(codeshift.decorator(config.generate()));
		return true;
	}
	return false;
}

export function defaultExportIsNativeClass(defaultExport) {
	// non-native will be CallExpression
	return defaultExport.type === 'ClassDeclaration';
}
