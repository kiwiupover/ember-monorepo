import codeshift from "jscodeshift";
import path from "path";

export function parseImport(config, modulePath) {
  const type = modulePath.replace(`${config.modulePrefix}/`, "").split("/")[0];
  const fullPath = path.resolve(
    modulePath.replace(config.modulePrefix, config.project + "/app") + ".js"
  );

  return {
    modulePath,
    type,
    fullPath,
  };
}

export function parseDefaultImports(code, prefix = "tax-bridge") {
  const imports = {
    byType: new Map(),
    byName: new Map(),
  };

  // determine import to use
  code.find(codeshift.ImportDeclaration).forEach((importPath) => {
    const { value } = importPath;
    const { source, specifiers } = value;

    const key = source.value;
    const type = key.replace(`${prefix}/`, "").split("/")[0];
    const DefaultImport = specifiers.find(
      (s) => s.type === "ImportDefaultSpecifier"
    );

    if (DefaultImport) {
      let typeMap = imports.byType.get(type);
      if (!typeMap) {
        typeMap = new Map();
        imports.byType.set(type, typeMap);
      }

      typeMap.set(DefaultImport.local.name, key);

      imports.byName.set(DefaultImport.local.name, key);
    }
  });

  return imports;
}
