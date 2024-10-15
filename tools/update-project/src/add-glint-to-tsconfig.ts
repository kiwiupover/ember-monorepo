import path from 'node:path';
import url from 'node:url';
import { promises as fs } from 'node:fs';

import { js, packageJson } from 'ember-apply';

/**
 * @param {string} location
 */
export async function addGlintToTsconfig(location: string) {
  await packageJson.addDevDependencies(
    {
      '@glint/core': '^1.4.0',
      '@glint/template': '^1.4.0',
      '@glint/environment-ember-loose': '^1.4.0',
      '@glint/environment-ember-template-imports': '^1.4.0',
    },
    location,
  );

  debugger;

  try {
    // Define the path to tsconfig.json
    const filePath = path.join(location, 'tsconfig.json');

    // Read the JSON file
    const data = await fs.readFile(filePath, 'utf8');

    // Remove comments from the JSON (supports single-line // and multi-line /* */ comments)
    const uncommentedData = data.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');

    // Parse the uncommented JSON data
    const json = JSON.parse(uncommentedData);

    // Check if the "glint" property already exists
    if (json.glint) {
      return;
    }

    // Add the "glint" property
    json.glint = {
      environment: ['ember-loose', 'ember-template-imports'],
    };

    // Convert the modified JSON object back to a string
    const updatedJson = JSON.stringify(json, null, 2);

    // Write the updated JSON back to the file
    await fs.writeFile(filePath, updatedJson, 'utf8');

    console.log('tsconfig successfully updated to use glint.');
  } catch (err) {
    console.error('Error:', err);
  }
}

// Resolve __dirname for ESM
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// Set the path for emberCliLibraryWatch
addGlintToTsconfig.path = __dirname;
