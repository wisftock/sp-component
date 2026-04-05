#!/usr/bin/env node
import pc from "picocolors";
import { addCommand } from "./commands/add.js";
import { listCommand } from "./commands/list.js";
import { initCommand } from "./commands/init.js";

const [,, command, ...args] = process.argv;

async function main() {
  switch (command) {
    case "add":
      await addCommand(args);
      break;

    case "list":
    case "ls":
      await listCommand();
      break;

    case "init":
      await initCommand();
      break;

    default:
      console.log("");
      console.log(pc.bold("sp-components") + pc.dim(" — SP Component CLI"));
      console.log("");
      console.log("Commands:");
      console.log(`  ${pc.cyan("init")}              Initialize SP Components in your project`);
      console.log(`  ${pc.cyan("add")} [components]   Add one or more components`);
      console.log(`  ${pc.cyan("list")}              List all available components`);
      console.log("");
      console.log("Examples:");
      console.log(pc.dim("  sp-components init"));
      console.log(pc.dim("  sp-components add button modal"));
      console.log(pc.dim("  sp-components list"));
      console.log("");
      if (command && command !== "--help" && command !== "-h") {
        console.log(pc.red(`Unknown command: ${command}`));
        process.exit(1);
      }
  }
}

main().catch((err) => {
  console.error(pc.red(`Fatal error: ${(err as Error).message}`));
  process.exit(1);
});
