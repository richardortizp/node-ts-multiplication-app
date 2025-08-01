import yargs from "yargs";
import { hideBin } from "yargs/helpers";

export const yarg = yargs(hideBin(process.argv))
  // .options({

  // })
  .option("b", {
    alias: "base",
    type: "number",
    demandOption: true,
    describe: "Multiplication table base",
  })
  .option("l", {
    alias: "limit",
    type: "number",
    default: 10,
    describe: "Multiplication table limit",
  })
  .option("s", {
    alias: "show",
    type: "boolean",
    default: false,
    describe: "Show multiplication table",
  })
  .option("n", {
    alias: "name",
    type: "string",
    default: "multiplication-table",
    describe: "File name",
  })
  .option("d", {
    alias: "destination",
    type: "string",
    default: "outputs",
    describe: "File destination",
  })
  .option("ex", {
    alias: "extension",
    type: "string",
    default: "txt",
    describe: "Extension file",
  })
  .check((argv, options) => {
    if (argv.b < 1) throw new Error("Error: base must be greater than 0");
    if (argv.l < 1) throw new Error("Error limit must be greater than 0");
    return true;
  })
  .parseAsync();
