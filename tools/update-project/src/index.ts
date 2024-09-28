import { cleanUpLint } from './clean-up-lints.ts';
import { updateNewApp } from './update-new-app.ts';
import { updateNewAddon } from './update-new-addon.ts';

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
