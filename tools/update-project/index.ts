import path from 'node:path';
import url from 'node:url';

import { cleanUpLint } from './clean-up-lints.js';
import { updateNewAddon, AddonInfo } from './update-addon.js';

export async function updateAddon(info: AddonInfo): Promise<void> {
  await updateNewAddon(info);
  await cleanUpLint(info.addonLocation);
  await cleanUpLint(info.testAppLocation);
}

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

updateAddon.path = __dirname;
