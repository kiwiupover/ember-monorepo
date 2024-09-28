import { promises as fs } from 'fs';

export async function moveGenerateApp(location: string, newLocation: string): Promise<void> {
  try {
    await fs.rename(location, newLocation);
    console.log(`Successfully moved ${location} to ${newLocation}`);
  } catch (error) {
    console.error(`Error moving ${location} to ${newLocation}:`, error);
    return;
  }
}
