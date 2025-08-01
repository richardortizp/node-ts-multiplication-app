import { SaveFile } from "../../../src/domain/use-cases/save-file.use-case";
import fs from "fs";

describe("SaveFileUseCase", () => {
  const customOptions = {
    fileContent: "Custom default content",
    fileDestination: "custom-outputs",
    fileName: "custom-table-name",
  };

  const customFilePath = `${customOptions.fileDestination}/${customOptions.fileName}.txt`;

  beforeEach(async () => {
    // verifica si existe la carpeta de outputs
    if (fs.existsSync("outputs")) {
      // Si existe elimina el directorio recusrivamente
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Pequeño retraso
      fs.rmSync("outputs", { recursive: true });
    }
    if (fs.existsSync(customOptions.fileDestination)) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Pequeño retraso
      fs.rmSync(customOptions.fileDestination, { recursive: true });
    }

    jest.clearAllMocks();
  });

  afterEach(async () => {
    // Igual, verifica si existe el directorio outputs
    if (fs.existsSync("outputs")) {
      // Si existe limpia el contenido de esa carpeta y la carpeta
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Pequeño retraso
      fs.rmSync("outputs", { recursive: true });
    }
    if (fs.existsSync(customOptions.fileDestination)) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Pequeño retraso
      fs.rmSync(customOptions.fileDestination, { recursive: true });
    }
  });

  test("should save file with default values", () => {
    const saveFile = new SaveFile();
    const filePath = "outputs/table.txt";
    const options = {
      fileContent: "test content",
    };

    const result = saveFile.execute(options);

    expect(result).toBe(true);

    const checkFile = fs.existsSync(filePath);
    const fileContent = fs.readFileSync(filePath, { encoding: "utf-8" });

    expect(checkFile).toBeTruthy();
    expect(fileContent).toBe(options.fileContent);
  });

  // test("should return false when fs.writeFileSync throws an error", () => {
  //   const saveFile = new SaveFile();
  //   const options = {
  //     fileContent: "test content",
  //   };

  //   // Mock console.log to avoid error output in tests
  //   const consoleSpy = jest.spyOn(console, "log").mockImplementation();

  //   // Mock fs.writeFileSync to throw an error
  //   const writeFileSyncSpy = jest
  //     .spyOn(fs, "writeFileSync")
  //     .mockImplementation(() => {
  //       throw new Error("Simulated file system error");
  //     });

  //   const result = saveFile.execute(options);
  //   expect(result).toBe(false);
  //   expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));

  //   // Restore the original implementations
  //   writeFileSyncSpy.mockRestore();
  //   consoleSpy.mockRestore();
  // });

  test("should save file with default values", () => {
    const saveFile = new SaveFile();

    const result = saveFile.execute(customOptions);

    const fileExists = fs.existsSync(customFilePath); // verifica si existe el archivo en el directorio
    const fileContent = fs.readFileSync(customFilePath, { encoding: "utf-8" });

    expect(result).toBe(true);
    expect(fileExists).toBe(true);
    expect(fileContent).toBe(customOptions.fileContent);
  });

  test("should return false if directory could not be created", () => {
    const saveFile = new SaveFile();
    /**
     * El mock/spy es utilizado para simular un error al crear un directorio.
     * Crea un espia sobre el metodo mkdirSync del metodo fs (File System de Node.js)
     * Objetivo: Observar si el metodo es llamada, con que argumentos, etc.
     * Sin .mockImplementation, el metodo real se ejecutará normalmente.
     *
     * Con.mockImplementation(() => { throw new Error('error)})
     * Reemplaza la implementación original de mkdirSync con una función personalizada que lanza un error.
     * Objetivo: Simular un fallo al crear un directorio (por ejemplo, permisos denegados, disco lleno, etc).
     *
     * const mkdirSpy:
     * Guarda la referencia al espia/mock para:
     * - Verificar llamadas despues (expect(mkdirSpy).toHaveBeenCalled())
     * - Restaurar la implementacion original al finalizar la prueba (mkdirSpy.mockRestore())
     */
    const mkdirSpy = jest.spyOn(fs, "mkdirSync").mockImplementation(() => {
      throw new Error("This is a custom error message from testing");
    });

    const result = saveFile.execute(customOptions);
    expect(result).toBe(false);

    mkdirSpy.mockRestore();
  });

  test("should return false if file could not be created", () => {
    const saveFile = new SaveFile();
    const writeFileSpy = jest
      .spyOn(fs, "writeFileSync")
      .mockImplementation(() => {
        throw new Error("This is a custom writing error message");
      });
    const result = saveFile.execute({ fileContent: "Hola" });

    expect(result).toBe(false);

    writeFileSpy.mockRestore();
  });
});
