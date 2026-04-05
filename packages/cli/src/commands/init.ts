import { join, resolve } from "node:path";
import { existsSync } from "node:fs";
import { copy, outputFile } from "fs-extra/esm";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import pc from "picocolors";
import * as p from "@clack/prompts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, "..", "..", "..", "..");

export async function initCommand(): Promise<void> {
  p.intro(pc.bgCyan(pc.black(" SP Components — Init ")));

  const dir = await p.text({
    message: "Where should the tokens file be placed?",
    placeholder: "src/styles",
    defaultValue: "src/styles",
  });

  if (p.isCancel(dir)) {
    p.cancel("Cancelled.");
    process.exit(0);
  }

  const targetDir = resolve(process.cwd(), dir as string);
  const tokensSrc = join(REPO_ROOT, "src", "tokens.css");
  const tokensDest = join(targetDir, "sp-tokens.css");

  // Copy tokens.css
  if (existsSync(tokensSrc)) {
    await copy(tokensSrc, tokensDest, { overwrite: false });
    p.log.success(`Copied sp-tokens.css → ${pc.dim(`${dir}/sp-tokens.css`)}`);
  } else {
    p.log.warn("Could not find tokens.css in the SP Components source. Skipping.");
  }

  // Write a minimal config stub
  const configDest = join(process.cwd(), "sp-components.config.ts");
  if (!existsSync(configDest)) {
    const configContent = [
      `import { SpConfig } from "sp-component";`,
      ``,
      `// Configure SP Components for your project`,
      `// SpConfig.setTheme("violet");`,
      `// SpConfig.setColorScheme("dark");`,
      `// SpConfig.setDensity("compact");`,
      `// SpConfig.setLocale({ modal: { closeLabel: "Cerrar" } });`,
      ``,
      `export { SpConfig };`,
    ].join("\n");

    await outputFile(configDest, configContent);
    p.log.success(`Created ${pc.dim("sp-components.config.ts")}`);
  }

  p.outro(pc.bold(pc.green("SP Components initialized!")));

  console.log("");
  console.log("Next steps:");
  console.log(`  1. Import the tokens in your main CSS/entry:`);
  console.log(pc.dim(`     @import "./${dir}/sp-tokens.css";`));
  console.log(`  2. Run ${pc.white("sp-components add <component>")} to add components`);
  console.log(`  3. Import and configure in ${pc.white("sp-components.config.ts")}`);
  console.log("");
}
