import { join } from "node:path";
import { existsSync } from "node:fs";
import { copy } from "fs-extra/esm";
import pc from "picocolors";
import * as p from "@clack/prompts";
import { listComponents, componentSrcDir } from "../utils/components.js";

export async function addCommand(names: string[]): Promise<void> {
  const available = listComponents();

  // Interactive prompt if no component names provided
  if (names.length === 0) {
    p.intro(pc.bgCyan(pc.black(" SP Components — Add ")));

    const selected = await p.multiselect({
      message: "Select components to add:",
      options: available.map((name) => ({ value: name, label: name })),
    });

    if (p.isCancel(selected)) {
      p.cancel("Cancelled.");
      process.exit(0);
    }

    names = selected as string[];
    p.outro("");
  }

  // Validate names
  const unknown = names.filter((n) => !available.includes(n));
  if (unknown.length > 0) {
    console.error(pc.red(`Unknown component(s): ${unknown.join(", ")}`));
    console.error(pc.dim(`Run ${pc.white("sp-components list")} to see available components.`));
    process.exit(1);
  }

  // Determine destination
  const destBase = join(process.cwd(), "src", "components", "sp");

  console.log("");
  console.log(pc.bold("Adding components..."));
  console.log("");

  for (const name of names) {
    const src = componentSrcDir(name);
    const dest = join(destBase, name);

    if (!existsSync(src)) {
      console.log(pc.yellow(`  ⚠  ${name} — source not found, skipped`));
      continue;
    }

    try {
      await copy(src, dest, { overwrite: false, errorOnExist: false });
      console.log(`  ${pc.green("✓")} ${name} → ${pc.dim(`src/components/sp/${name}/`)}`);
    } catch (err) {
      console.log(`  ${pc.red("✗")} ${name} — ${(err as Error).message}`);
    }
  }

  console.log("");
  console.log(pc.bold(pc.green("Done!")));
  console.log(pc.dim("Import your components from their new location."));
  console.log("");
}
