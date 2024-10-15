import { cleanUpLint } from './clean-up-lints.ts';
import { updateNewApp } from './update-new-app.ts';
import { updateNewAddon } from './update-new-addon.ts';
import { moveGenerateApp } from './move-generate-app.ts';
import { installTailwindCss } from './install-tailwindcss.ts';

import type { AppInfo } from './update-new-app.ts';
import type { AddonInfo } from './update-new-addon.ts';

export async function updateApp(info: AppInfo): Promise<void> {
  await updateNewApp(info);
}

export async function updateAddon(info: AddonInfo): Promise<void> {
  await updateNewAddon(info);
}

export async function cleanUp(location: string) {
  await cleanUpLint(location);
}

export async function moveApp(location: string, newLocation: string) {
  await moveGenerateApp(location, newLocation);
}

export async function installTailwind(location: string) {
  await installTailwindCss(location);
}
