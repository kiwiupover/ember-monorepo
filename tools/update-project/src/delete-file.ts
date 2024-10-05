import { promises as fs } from 'node:fs';

/**
 * @param {string} file
 */
export async function deleteFile(file: string) {
  try {
    await fs.unlink(file);
    console.log('File deleted successfully,', file);
  } catch (err) {
    console.error('Error deleting the file:', err);
  }
}
