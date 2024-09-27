import { cleanUpLint } from './clean-up-lints.ts';
import { updateNewAddon } from './update-new-addon.ts';

import type { AddonInfo } from './update-new-addon.ts';

export async function updateAddon(info: AddonInfo): Promise<void> {
  await updateNewAddon(info);
}

export async function cleanUp(location: string) {
  await cleanUpLint(location);
}
