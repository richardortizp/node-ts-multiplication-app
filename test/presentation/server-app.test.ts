import { CreateTable } from "../../src/domain/use-cases/create-table.use-case";
import { SaveFile } from "../../src/domain/use-cases/save-file.use-case";
import { ServerApp } from "../../src/presentation/server-app";
import fs from "fs";

describe("Pruebas en server-app.ts", () => {
  const options = {
    base: 2,
    limit: 10,
    showTable: false,
    fileDestination: "test-destination",
    fileName: "test-filename",
    fileExtension: "txt",
  };

  afterEach(async () => {
    jest.clearAllMocks();
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (fs.existsSync(options.fileDestination)) {
      fs.rmSync(options.fileDestination, { recursive: true });
    }
  });
  beforeEach(async () => {
    jest.clearAllMocks();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (fs.existsSync(options.fileDestination)) {
      fs.rmSync(options.fileDestination, { recursive: true });
    }
  });
  test("should created server-app", () => {
    const serverApp = new ServerApp();
    expect(serverApp).toBeInstanceOf(ServerApp);
    expect(typeof ServerApp.run).toBe("function");
  });

  test("should run server app with options", () => {
    const logSpy = jest.spyOn(console, "log");
    const createTableSpy = jest.spyOn(CreateTable.prototype, "execute");
    const saveFileSpy = jest.spyOn(SaveFile.prototype, "execute");

    const options = {
      base: 2,
      limit: 10,
      showTable: false,
      fileDestination: "test-destination",
      fileName: "test-filename",
      fileExtension: "txt",
    };
    ServerApp.run(options);
    expect(logSpy).toHaveBeenCalledTimes(2);
    expect(logSpy).toHaveBeenCalledWith("Server running...");
    expect(logSpy).toHaveBeenCalledWith("File created!");

    expect(createTableSpy).toHaveBeenCalledTimes(1);
    expect(createTableSpy).toHaveBeenCalledWith({
      base: options.base,
      limit: options.limit,
    });

    expect(saveFileSpy).toHaveBeenCalledTimes(1);
    expect(saveFileSpy).toHaveBeenCalledWith({
      fileContent: expect.any(String),
      fileDestination: options.fileDestination,
      fileName: options.fileName,
      fileExtension: options.fileExtension,
    });
  });

  test("should run serverApp with show table option", () => {
    const logSpy = jest.spyOn(console, "log");
    const options = {
      base: 2,
      limit: 10,
      showTable: true,
      fileDestination: "test-destination",
      fileName: "test-filename",
      fileExtension: "txt",
    };
    ServerApp.run(options);
    expect(logSpy).toHaveBeenCalledTimes(3);
    expect(logSpy).toHaveBeenCalledWith("File created!");
  });

  test("should show 'File not created!' message when wasCreated is false", () => {
    const logSpy = jest.spyOn(console, "log");
    jest.spyOn(SaveFile.prototype, "execute").mockReturnValue(false);

    const options = {
      base: 2,
      limit: 10,
      showTable: false,
      fileDestination: "test-destination",
      fileName: "test-filename",
      fileExtension: "txt",
    };
    ServerApp.run(options);

    expect(logSpy).toHaveBeenCalledWith("File not created!");
  });

  test("should run with custom values mocked", () => {
    const logMock = jest.fn();
    const logErrorMock = jest.fn();
    const createMock = jest.fn().mockReturnValue("1 x 2 = 2");
    const saveFileMock = jest.fn().mockReturnValue(true);

    CreateTable.prototype.execute = createMock;
    SaveFile.prototype.execute = saveFileMock;
    global.console.log = logMock;
    global.console.error = logErrorMock;

    ServerApp.run(options);

    expect(logMock).toHaveBeenCalledWith("Server running...");
    expect(createMock).toHaveBeenCalledWith({
      base: options.base,
      limit: options.limit,
    });
    expect(saveFileMock).toHaveBeenCalledWith({
      fileContent: "1 x 2 = 2",
      fileDestination: options.fileDestination,
      fileName: options.fileName,
      fileExtension: options.fileExtension,
    });
    expect(logMock).toHaveBeenCalledWith("File created!");
    expect(logErrorMock).not.toHaveBeenCalledWith();
  });
});
