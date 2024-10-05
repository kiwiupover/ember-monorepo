import { promises as fs } from 'fs';
import * as path from 'path';

/**
 * Replaces occurrences of '@repo/REPLACE_WITH_PACKAGE_NAME' with the provided packageName
 * in all '.gts' files within the specified directory and its subdirectories,
 * at least three levels deep, excluding 'node_modules' folder.
 *
 * @param directory - The path to the directory to search.
 * @param packageName - The package name to replace in the files.
 */
export async function updateImportPackageName(directory: string, packageName: string): Promise<void> {
  // Start the recursive traversal with depth 0
  await processDirectory(directory, packageName, 0);
}

/**
 * Recursively processes directories and files.
 *
 * @param directory - Current directory path.
 * @param packageName - The package name to replace in the files.
 * @param depth - Current depth of recursion.
 */
async function processDirectory(directory: string, packageName: string, depth: number): Promise<void> {
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);

      // Skip 'node_modules' directory
      if (entry.name === 'node_modules') {
        continue;
      }

      if (entry.isDirectory()) {
        // Continue recursion
        await processDirectory(fullPath, packageName, depth + 1);
      } else if (entry.isFile() && (path.extname(entry.name) === '.gts' || path.extname(entry.name) === '.json')) {
        try {
          const data = await fs.readFile(fullPath, 'utf8');
          const newPackageName = packageName.startsWith('@repo/') ? packageName : `@repo/${packageName}`;
          const result = data.replace(/@repo\/REPLACE_WITH_PACKAGE_NAME/g, newPackageName);
          await fs.writeFile(fullPath, result, 'utf8');
          console.log(`Updated file: ${fullPath}`);
        } catch (err) {
          console.error(`Error processing file ${fullPath}: ${(err as Error).message}`);
        }
      }
    }
  } catch (err) {
    console.error(`Unable to read directory ${directory}: ${(err as Error).message}`);
  }
}
