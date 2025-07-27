import { yarg } from "./config/plugins/yargs.plugin";
import { ServerApp } from "./presentation/server-app";

(async () => {
  //   console.log("Ejecutado");
  await main();
  //   console.log("Fin del programa");
})();

async function main() {
  const {
    b: base,
    l: limit,
    s: showTable,
    n: fileName,
    d: fileDestination,
    ex: fileExtension,
  } = await yarg;
  ServerApp.run({
    base,
    limit,
    showTable,
    fileName,
    fileDestination,
    fileExtension,
  });
}
