import { memoSimpleFn } from './memoize.mjs';

export function setToString(set) {
	return `[ ${[...set].join(', ')} ]`;
}

export const dasherize = memoSimpleFn(function dasherize(str) {
	let dasherized = str.replace(/[A-Z]/g, function (char, index) {
		return (index !== 0 ? '-' : '') + char.toLowerCase();
	});
	dasherized = dasherized.replace(/_/g, '-');
	dasherized = dasherized.replace(/-{2,}/g, '-');
	return dasherized;
});

export const singularize = memoSimpleFn(function (str) {
	if (str.endsWith('ies')) {
		return str.substr(0, str.length - 3) + 'y';
	}
	if (str.endsWith('ess') || str.endsWith('us')) {
		return str;
	}
	if (str.endsWith('s')) {
		return str.substr(0, str.length - 1);
	}
	return str;
});

export const classify = memoSimpleFn(function (str) {
	let capitalized = str.replace(/-[a-z]/g, function (char) {
		return char.charAt(1).toUpperCase();
	});
	capitalized = capitalized.replace(/\/[a-z]/g, function (char) {
		return char.charAt(1).toUpperCase();
	});
	return capitalized.charAt(0).toUpperCase() + capitalized.substr(1);
});

export const capitalize = memoSimpleFn(function (str) {
	const capitalized = str.replace(/-[a-z]/g, function (char) {
		return char.charAt(1).toUpperCase();
	});
	return capitalized.charAt(0).toUpperCase() + capitalized.substr(1);
});
