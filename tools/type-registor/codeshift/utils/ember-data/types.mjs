import { getConfig } from '../get-config.mjs';
import { convertPathToImport, nicePath } from '../path.mjs';
import { dasherize, singularize } from '../string.mjs';

const CONFIG = getConfig();

export function normalizeModelName(str) {
	return singularize(dasherize(str));
}

export function parseModelTypeFromPath(filePath) {
	let shorter = nicePath(filePath);
	shorter = shorter.replace(`${CONFIG.project}/app/`, '');

	const isModel = filePath.indexOf('/app/models/') !== -1;
	const isMixin = filePath.indexOf('/app/mixins/') !== -1;

	if (isModel) {
		shorter = shorter.replace(`models/`, '');
		shorter = shorter.replace('.js', '');
		shorter = shorter.replace('.ts', '');
		return shorter;
	}
	if (isMixin) {
		shorter = shorter.replace(`mixins/`, '');
		shorter = shorter.replace('.js', '');
		shorter = shorter.replace('.ts', '');
		return shorter;
	}

	// we are not a resolvable import type, though we may be
	// "importable". Define our type as the full module path.
	return convertPathToImport(filePath);
}
