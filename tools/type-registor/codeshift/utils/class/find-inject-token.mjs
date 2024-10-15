import codeshift from 'jscodeshift';

export default function findInjectToken(code) {
	let usesServicePackage = false;
	let defaultServiceImportName = 'Service';
	let hasInjectionImport = false;
	const useServiceAsImportedName = false;
	let hasOtherInject = false;
	let hasOtherService = false;
	let importedLocalInjectionName = '';
	let hasDefaultImport = false;

	// determine import to use
	code.find(codeshift.ImportDeclaration).forEach((path) => {
		const { value } = path;
		const { source, specifiers } = value;

		if (source.value === '@ember/service') {
			usesServicePackage = true;
			const serviceImport = specifiers.find((s) => s.type === 'ImportDefaultSpecifier');

			if (serviceImport) {
				hasDefaultImport = true;
				defaultServiceImportName = serviceImport.local.name;
			}
			if (specifiers && specifiers.length > 0) {
				const imported = specifiers.find((s) => {
					return s.imported && (s.imported.name === 'inject' || s.imported.name === 'service'); // more recent versions of ember utilize `service`
				});
				if (imported) {
					hasInjectionImport = true;
					importedLocalInjectionName = imported.local.name || 'service';
				}
			}
		} else {
			const otherInject = specifiers.find((s) => s.local && s.local.name === 'inject');
			if (otherInject) {
				hasOtherInject = true;
			}
			const otherService = specifiers.find((s) => s.local && s.local.name === 'service');
			if (otherService) {
				hasOtherService = true;
			}
		}
	});

	const injectionImportName = useServiceAsImportedName ? 'service' : 'inject';
	const injectionLocalName = hasOtherService ? (hasOtherInject ? '_emberService_' : 'inject') : 'service';
	const useLocalName = injectionLocalName !== injectionImportName;

	return {
		// whether this module already imports from @ember/service
		usesServicePackage,
		// whether we are importing `service` or importing `inject` from @ember/service (~ ember 4.0 dependent)
		// currently always false, requires feature detection
		useServiceAsImportedName,
		// whether this module imports inject/service from @ember/service
		hasInjectionImport,
		// whether any other import from a different package is named `inject`
		hasOtherInject,
		// whether any other import from a different package is named `service`
		hasOtherService,
		// whether the local difers from the Imported
		useLocalName,
		// the Identifier.name the default import from @ember/service is being used as (if any)
		// defaults to `Service` if none found
		defaultServiceImportName,
		// the local Identifier.name of inject/service imported from @ember/service
		importedLocalInjectionName,
		// the imported Identifier.name from @ember/service
		injectionImportName,
		// the local Identifier.name to use for injections
		injectionLocalName,
		// whether we have the default import
		hasDefaultImport,
	};
}
