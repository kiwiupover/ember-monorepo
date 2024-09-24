import path from "node:path";
import url from "node:url";

import { cleanUpLint } from "./clean-up-lints.js";
import { updateNewAddon } from "./update-addon.js";

/**
 * @param {{ addonLocation: string; packageName: string; root?: string; testAppLocation: string; }} info
 */
export async function updateAddon(info) {
  await updateNewAddon(info);
  await cleanUpLint(info.addonLocation);
  await cleanUpLint(info.testAppLocation);
}

// @ts-ignore
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

updateAddon.path = __dirname;
