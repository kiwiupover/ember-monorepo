/* eslint-disable @typescript-eslint/no-unused-expressions */
import { globby } from 'globby';
import fs from 'node:fs';
import path from 'node:path';

import { getConfig } from './get-config.mjs';

const FILE_CACHE = {};

export async function getFilesByType(type, options) {
  if (!options && FILE_CACHE[type]) {
    return FILE_CACHE[type];
  }
  const scriptFileExt = options?.ignoreTsFiles ? `.{js,gjs}` : `.{js,gjs,ts,gts}`;
  const config = getConfig();
  const APP_ROOT = config.project;

  if (type === 'template-only-component') {
    const componentTemplates = await globby(path.join(APP_ROOT, `app/components/**/*.hbs`));
    let components = await getFilesByType('component');
    components = new Set(components);

    const templateOnly = [];
    componentTemplates.forEach((filePath) => {
      const parsed = path.parse(filePath);
      const componentPath = path.join(parsed.dir, parsed.name + '.js');
      const tsComponentPath = path.join(parsed.dir, parsed.name + '.ts');

      if (!components.has(componentPath) && !components.has(tsComponentPath)) {
        templateOnly.push(filePath);
      }
    });

    !options && (FILE_CACHE['template-only-component'] = templateOnly);
    return templateOnly;
  } else if (type === 'template-only-route') {
    const routeTemplates = await globby(path.join(APP_ROOT, `app/routes/**/template.hbs`));
    let controllers = await getFilesByType('controller');
    controllers = new Set(controllers);

    const templateOnly = [];
    routeTemplates.forEach((filePath) => {
      const parsed = path.parse(filePath);
      const controllerPath = path.join(parsed.dir, 'controller.js');
      const tsControllerPath = path.join(parsed.dir, 'controller.ts');

      if (!controllers.has(controllerPath) && !controllers.has(tsControllerPath)) {
        templateOnly.push(filePath);
      }
    });

    !options && (FILE_CACHE['template-only-route'] = templateOnly);
    return templateOnly;
  } else if (type === 'component') {
    const result = await globby(path.join(APP_ROOT, `app/components/**/*${scriptFileExt}`));
    !options && (FILE_CACHE[type] = result);
    return result;
  } else if (type === 'helper') {
    const result = await globby(path.join(APP_ROOT, `app/helpers/**/*${scriptFileExt}`));
    !options && (FILE_CACHE[type] = result);
    return result;
  } else if (type === 'modifier') {
    const result = await globby(path.join(APP_ROOT, `app/modifiers/**/*${scriptFileExt}`));
    !options && (FILE_CACHE[type] = result);
    return result;
  } else if (type === 'model') {
    const result = await globby(path.join(APP_ROOT, `app/models/**/*${scriptFileExt}`));
    !options && (FILE_CACHE[type] = result);
    return result;
  } else if (type === 'transform') {
    const result = await globby(path.join(APP_ROOT, `app/transforms/**/*${scriptFileExt}`));
    !options && (FILE_CACHE[type] = result);
    return result;
  } else if (type === 'service') {
    const result = await globby(path.join(APP_ROOT, `app/services/**/*${scriptFileExt}`));
    !options && (FILE_CACHE[type] = result);
    return result;
  } else if (type === 'mixin') {
    const result = await globby(path.join(APP_ROOT, `app/mixins/**/*${scriptFileExt}`));
    !options && (FILE_CACHE[type] = result);
    return result;
  } else if (type === 'util') {
    const result = await globby(path.join(APP_ROOT, `app/utils/**/*${scriptFileExt}`));
    !!options && (FILE_CACHE[type] = result);
    return result;
  } else if (type === 'adapter') {
    const result = await globby(path.join(APP_ROOT, `app/adapters/**/*${scriptFileExt}`));
    !options && (FILE_CACHE[type] = result);
    return result;
  } else if (type === 'serializer') {
    const result = await globby(path.join(APP_ROOT, `app/serializers/**/*${scriptFileExt}`));
    !options && (FILE_CACHE[type] = result);
    return result;
  } else if (type === 'template') {
    const result = await globby(path.join(APP_ROOT, options?.includeGjs ? `app/**/*.{hbs,gjs,gts}` : `app/**/*.hbs`));
    !options && (FILE_CACHE[type] = result);
    return result;
  } else if (type === 'script') {
    const result = await globby(path.join(APP_ROOT, `app/**/*${scriptFileExt}`));
    !options && (FILE_CACHE[type] = result);
    return result;
  }
  const result = await globby(path.join(APP_ROOT, `app/routes/**/${type}${scriptFileExt}`));
  !options && (FILE_CACHE[type] = result);
  return result;
}

export function convertImportToPath(modulePath) {
  const CONFIG = getConfig();
  if (!modulePath.startsWith(CONFIG.modulePrefix)) {
    return modulePath;
  }
  const jsFilePath = path.resolve(modulePath.replace(CONFIG.modulePrefix, CONFIG.project + '/app') + '.js');
  if (fileExists(jsFilePath)) {
    return jsFilePath;
  }
  const tsFilePath = path.resolve(modulePath.replace(CONFIG.modulePrefix, CONFIG.project + '/app') + '.ts');
  if (fileExists(tsFilePath)) {
    return tsFilePath;
  }
  return modulePath;
}

export function fileExists(file) {
  try {
    if (fs.statSync(file)) {
      return true;
    }
    return false;
  } catch (error) {
    console.log({ error });
    return false;
  }
}
