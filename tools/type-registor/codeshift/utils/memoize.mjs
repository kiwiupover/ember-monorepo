export function memoSimpleFn(fn) {
	const cache = new Map();
	const cachingFn = (arg) => {
		let result = cache.get(arg);
		if (!result) {
			result = fn(arg);
			cache.set(arg, result);
		}
		return result;
	};
	cachingFn.cache = cache;
	return cachingFn;
}

const UNDEFINED = {};

export function onceFn(fn) {
	let result = UNDEFINED;
	return () => {
		if (result === UNDEFINED) {
			result = fn();
		}
		return result;
	};
}
