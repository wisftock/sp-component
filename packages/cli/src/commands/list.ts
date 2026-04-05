import pc from "picocolors";
import { listComponents } from "../utils/components.js";

export async function listCommand(): Promise<void> {
  let components: string[];
  try {
    components = listComponents();
  } catch (err) {
    console.error(pc.red(`Error: ${(err as Error).message}`));
    process.exit(1);
  }

  console.log("");
  console.log(pc.bold(pc.cyan("Available SP Components:")));
  console.log("");

  for (const name of components) {
    console.log(`  ${pc.green("◆")} ${name}`);
  }

  console.log("");
  console.log(
    pc.dim(`Total: ${components.length} components`),
  );
  console.log(
    pc.dim(`\nUsage: sp-components add <component> [component...]`),
  );
  console.log("");
}
