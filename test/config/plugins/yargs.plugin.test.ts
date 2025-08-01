// import { yarg } from "../../../src/config/plugins/yargs.plugin";

const runCommand = async (args: string[]) => {
  process.argv = [...process.argv, ...args];
  jest.resetModules(); // limpiamos la cache del modulo para forzar una nueva importacion
  try {
    const { yarg } = await import("../../../src/config/plugins/yargs.plugin");
    return yarg;
  } catch (error) {
    throw new Error(error as string);
  }
};

const originalArgv = process.argv;
const originalExit = process.exit;

beforeEach(() => {
  process.argv = originalArgv;
  jest.resetModules();
  // Mock process.exit to prevent tests from terminating
  process.exit = jest.fn() as any;
});

afterEach(() => {
  // Restore original process.exit
  process.exit = originalExit;
});

describe("Test args.plugin.ts", () => {
  test("should return default values", async () => {
    const argv = await runCommand(["-b", "5"]);

    expect(argv).toEqual(
      expect.objectContaining({
        b: 5,
        l: 10,
        s: false,
        n: "multiplication-table",
        d: "outputs",
        ex: "txt",
      })
    );
  });
  test("should return configuration with custom values", async () => {
    const argv = await runCommand([
      "-b",
      "2",
      "-l",
      "9",
      "-s",
      "-n",
      "custom-name",
      "-d",
      "custom-dir",
    ]);
    expect(argv).toEqual(
      expect.objectContaining({
        b: 2,
        l: 9,
        s: true,
        n: "custom-name",
        d: "custom-dir",
      })
    );
  });

  test("should handle validation for base less than 1", async () => {
    // Mock console.error to capture yargs error output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    const argv = await runCommand(["-b", "0"]);
    
    // Verify that yargs still processes the argument even with validation error
    expect(argv.b).toBe(0);
    expect(argv.base).toBe(0);
    
    // Verify that error was logged to console
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Error: base must be greater than 0"));
    
    consoleSpy.mockRestore();
  });

  test("should handle validation for negative base", async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    const argv = await runCommand(["-b", "-1"]);
    
    expect(argv.b).toBe(-1);
    expect(argv.base).toBe(-1);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Error: base must be greater than 0"));
    
    consoleSpy.mockRestore();
  });

  test("should handle validation for limit less than 1", async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    const argv = await runCommand(["-b", "5", "-l", "0"]);
    
    expect(argv.l).toBe(0);
    expect(argv.limit).toBe(0);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Error limit must be greater than 0"));
    
    consoleSpy.mockRestore();
  });

  test("should handle validation for negative limit", async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    const argv = await runCommand(["-b", "5", "-l", "-1"]);
    
    expect(argv.l).toBe(-1);
    expect(argv.limit).toBe(-1);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Error limit must be greater than 0"));
    
    consoleSpy.mockRestore();
  });
});
