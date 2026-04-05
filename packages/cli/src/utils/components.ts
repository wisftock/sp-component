import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { readdirSync, existsSync } from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** Absolute path to the monorepo root (packages/cli/dist → root) */
const REPO_ROOT = join(__dirname, "..", "..", "..", "..");

/** Absolute path to the sp-component source components directory */
export const COMPONENTS_SRC = join(REPO_ROOT, "src", "components");

/**
 * Returns the list of all available component names
 * (directory names inside src/components).
 */
export function listComponents(): string[] {
  if (!existsSync(COMPONENTS_SRC)) {
    throw new Error(`Could not find components directory at ${COMPONENTS_SRC}`);
  }
  return readdirSync(COMPONENTS_SRC, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

/** Resolves the source directory for a given component name. */
export function componentSrcDir(name: string): string {
  return join(COMPONENTS_SRC, name);
}
