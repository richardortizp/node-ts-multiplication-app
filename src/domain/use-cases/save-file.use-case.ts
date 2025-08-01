import fs from "fs";

export interface SaveFileUseCase {
  execute: (options: Options) => boolean;
}
export interface Options {
  fileContent: string;
  fileDestination?: string;
  fileName?: string;
  fileExtension?: string;
}

export class SaveFile implements SaveFileUseCase {
  constructor(/**repository: StorageRepository */) {}

  execute({
    fileContent,
    fileDestination = "outputs",
    fileName = "table",
    fileExtension = "txt",
  }: Options): boolean {
    try {
      fs.mkdirSync(fileDestination, { recursive: true });
      fs.writeFileSync(
        `${fileDestination}/${fileName}.${fileExtension}`,
        fileContent
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
