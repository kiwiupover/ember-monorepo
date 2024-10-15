import codeshift from 'jscodeshift';

export function insertInjectionImport(code, serviceImportInfo /*, filePath*/) {
	let didModifyInjections = false;
	const {
		useLocalName,
		defaultServiceImportName,
		injectionImportName,
		injectionLocalName,
		hasInjectionImport,
		importedLocalInjectionName,
		hasDefaultImport,
		usesServicePackage,
	} = serviceImportInfo;

	// rewrite inject() to service()
	if (hasInjectionImport && importedLocalInjectionName !== injectionLocalName) {
		code.find(codeshift.CallExpression).forEach((path) => {
			const { callee } = path.value;
			if (callee.type === 'Identifier' && callee.name === importedLocalInjectionName) {
				didModifyInjections = true;
				// console.log(`\n\n\trewriting @inject() to @service()\n\n`);
				callee.name = injectionLocalName;
			}
		});
		code.find(codeshift.Decorator).forEach((path) => {
			const { expression } = path.value;
			if (expression.type === 'Identifier' && expression.name === importedLocalInjectionName) {
				// console.log(`\n\n\trewriting @inject to @service\n\n`);
				didModifyInjections = true;
				expression.name = injectionLocalName;
			}
		});
		// a bug prevents the above from properly finding decorators on class properties
		// this fallback handles them.
		code.find(codeshift.ClassProperty).forEach((path) => {
			const { decorators } = path.value;
			if (decorators && decorators.length > 0) {
				decorators.forEach((node) => {
					const { expression } = node;
					if (expression.type === 'CallExpression') {
						const { callee } = expression;
						if (callee.type === 'Identifier' && callee.name === importedLocalInjectionName) {
							didModifyInjections = true;
							// console.log(`\n\n\trewriting @inject() to @service()\n\n`);
							callee.name = injectionLocalName;
						}
					} else if (expression.type === 'Identifier' && expression.name === importedLocalInjectionName) {
						// console.log(`\n\n\trewriting @inject to @service\n\n`);
						didModifyInjections = true;
						expression.name = injectionLocalName;
					}
				});
			}
		});
	}

	if (hasDefaultImport) {
		// TODO possibly overly eager
		didModifyInjections = true;
		code
			.find(codeshift.ImportDeclaration)
			.filter((path) => path.value.source.value === '@ember/service')
			.at(0)
			.replaceWith(
				`import ${defaultServiceImportName}, { ${injectionImportName}${
					useLocalName ? ' as ' + injectionLocalName : ''
				} } from "@ember/service";`,
			);
	} else if (hasInjectionImport && importedLocalInjectionName !== injectionLocalName) {
		didModifyInjections = true;
		code
			.find(codeshift.ImportDeclaration)
			.filter((path) => path.value.source.value === '@ember/service')
			.at(0)
			.replaceWith(
				`import { ${injectionImportName}${useLocalName ? ' as ' + injectionLocalName : ''} } from "@ember/service";`,
			);
	} else if (!usesServicePackage) {
		didModifyInjections = true;
		code
			.find(codeshift.ImportDeclaration)
			.at(-1)
			.insertAfter(
				`import { ${injectionImportName}${useLocalName ? ' as ' + injectionLocalName : ''} } from "@ember/service";`,
			);
	}

	return didModifyInjections;
}
