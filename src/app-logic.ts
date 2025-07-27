import fs from "fs";
import path from "path";
import { yarg } from "./config/plugins/yargs.plugin";

const tareaTabla = async () => {
  const args = await yarg;
  let result = ``;
  const { b: base, l: limit, s: showTable } = args;
  const header = `
===========================
    Tabla del ${base}
===========================`;

  for (let i = 1; i <= limit; i++) {
    result += `${base} x ${i} = ${base * i}\n`;
  }
  result = header + "\n" + result;

  if (showTable) {
    console.log(result);
  }

  const outputPath = "./outputs";
  fs.mkdirSync(outputPath, { recursive: true });
  fs.writeFileSync(`${outputPath}/tabla-${base}.txt`, result);
  console.log("Archivo creado correctamente");
};

tareaTabla();
