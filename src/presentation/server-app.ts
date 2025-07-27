import { CreateTable } from "../domain/use-cases/create-table.use-case";
import { SaveFile } from "../domain/use-cases/save-file.use-case";

export interface RunOptions {
  base: number;
  limit: number;
  showTable: boolean;
  fileDestination: string;
  fileName: string;
  fileExtension: string;
}

export class ServerApp {
  static run({
    base,
    limit,
    showTable,
    fileDestination,
    fileName,
    fileExtension,
  }: RunOptions) {
    console.log("Server running...");

    const table = new CreateTable().execute({ base, limit });

    const wasCreated = new SaveFile().execute({
      fileContent: table,
      fileDestination: fileDestination,
      fileName: fileName,
      fileExtension: fileExtension,
    });

    if (showTable) console.log(table);

    wasCreated
      ? console.log("File created!")
      : console.log("File not created!");
  }
}
