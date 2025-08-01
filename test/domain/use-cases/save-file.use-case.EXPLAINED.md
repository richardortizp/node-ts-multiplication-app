import { SaveFile } from "../../../src/domain/use-cases/save-file.use-case";
import fs from "fs";

/**
 * CONCEPTOS FUNDAMENTALES DE TESTING
 * 
 * 1. MOCKS (Simulacros):
 *    - Son "imitaciones" de funciones reales
 *    - Permiten controlar qué hace una función sin ejecutar la función real
 *    - Útiles para simular errores, controlar valores de retorno, etc.
 * 
 * 2. SPIES (Espías):
 *    - Son "observadores" que vigilan si una función fue llamada
 *    - Pueden ver: cuántas veces se llamó, con qué parámetros, etc.
 *    - Pueden combinarse con mocks para espiar Y simular comportamiento
 * 
 * 3. INTEGRATION vs UNIT TESTS:
 *    - Unit tests: Prueban una pieza de código aislada (usando mocks)
 *    - Integration tests: Prueban cómo funciona el código con dependencias reales
 */

describe("SaveFileUseCase", () => {
  
  /**
   * beforeEach(): Se ejecuta ANTES de cada test individual
   * - Prepara el ambiente para cada prueba
   * - Aquí limpiamos el directorio "outputs" para empezar cada test limpio
   */
  beforeEach(() => {
    // Verificamos si existe el directorio antes de intentar eliminarlo
    // Esto evita errores si el directorio no existe
    if (fs.existsSync("outputs")) {
      fs.rmSync("outputs", { recursive: true }); // Elimina todo el directorio
    }
  });
  
  /**
   * afterEach(): Se ejecuta DESPUÉS de cada test individual
   * - Limpia los efectos secundarios de cada prueba
   * - Mantiene las pruebas independientes entre sí
   */
  afterEach(() => {
    if (fs.existsSync("outputs")) {
      fs.rmSync("outputs", { recursive: true });
    }
  });

  /**
   * INTEGRATION TEST (Prueba de Integración)
   * - Esta prueba usa las funciones REALES del sistema de archivos
   * - No usa mocks, por eso realmente crea archivos en el disco
   * - Verifica que todo el flujo funcione correctamente
   */
  test("should save file with default values", () => {
    // ARRANGE (Preparar): Configuramos los datos de entrada
    const saveFile = new SaveFile();
    const filePath = "outputs/table.txt";
    const options = {
      fileContent: "test content",
    };

    // ACT (Actuar): Ejecutamos la función que queremos probar
    const result = saveFile.execute(options);

    // ASSERT (Verificar): Comprobamos que los resultados sean correctos
    
    // 1. Verificamos que la función retorne true (éxito)
    expect(result).toBe(true);

    // 2. Verificamos que el archivo realmente se haya creado en el disco
    const checkFile = fs.existsSync(filePath);
    
    // 3. Leemos el contenido real del archivo desde el disco
    const fileContent = fs.readFileSync(filePath, { encoding: "utf-8" });

    // 4. Verificamos que el archivo existe
    expect(checkFile).toBeTruthy();
    
    // 5. Verificamos que el contenido sea el correcto
    expect(fileContent).toBe(options.fileContent);
  });

  /**
   * UNIT TEST CON MOCKS (Prueba Unitaria con Simulacros)
   * - Esta prueba NO usa funciones reales del sistema de archivos
   * - Usa MOCKS para simular errores y controlar el comportamiento
   * - Es más rápida y predecible que la prueba de integración
   */
  test("should return false when fs.writeFileSync throws an error", () => {
    // ARRANGE: Preparamos el escenario de prueba
    const saveFile = new SaveFile();
    const options = {
      fileContent: "test content",
    };

    /**
     * SPY + MOCK en console.log:
     * 
     * ¿Qué hace jest.spyOn()?
     * - Crea un "espía" que vigila la función console.log
     * - El espía puede ver si la función fue llamada, cuántas veces, con qué parámetros
     * 
     * ¿Qué hace .mockImplementation()?
     * - Reemplaza la función real con una función vacía
     * - En este caso, console.log no imprimirá nada durante la prueba
     * - Esto mantiene la salida de la prueba limpia
     */
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    
    /**
     * SPY + MOCK en fs.writeFileSync:
     * 
     * ¿Por qué hacemos esto?
     * - Queremos probar el bloque catch{} de nuestro código
     * - Para que se ejecute el catch, necesitamos que writeFileSync lance un error
     * - En lugar de causar un error real, simulamos uno
     * 
     * ¿Cómo funciona?
     * - jest.spyOn(fs, "writeFileSync"): Crea un espía en la función writeFileSync
     * - .mockImplementation(() => { throw new Error(...) }): 
     *   Reemplaza writeFileSync con una función que siempre lanza un error
     */
    const writeFileSyncSpy = jest
      .spyOn(fs, "writeFileSync")
      .mockImplementation(() => {
        throw new Error("Simulated file system error");
      });

    // ACT: Ejecutamos la función
    // Como writeFileSync va a lanzar un error (simulado), 
    // el código irá al bloque catch{} y retornará false
    const result = saveFile.execute(options);

    // ASSERT: Verificamos los resultados
    
    // 1. Verificamos que la función retorne false (porque hubo un error)
    expect(result).toBe(false);
    
    /**
     * 2. Verificamos que console.log fue llamado con un error
     * 
     * ¿Por qué esto es importante?
     * - Nuestro código hace console.log(error) en el catch
     * - Queremos asegurar que ese código se ejecutó
     * - expect.any(Error) significa "cualquier objeto de tipo Error"
     */
    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));

    /**
     * LIMPIEZA (Cleanup):
     * 
     * ¿Por qué hacemos mockRestore()?
     * - Los mocks cambian el comportamiento de las funciones globalmente
     * - Si no los restauramos, pueden afectar otras pruebas
     * - mockRestore() devuelve las funciones a su comportamiento original
     * 
     * Es como "deshacer" los cambios que hicimos
     */
    writeFileSyncSpy.mockRestore(); // fs.writeFileSync funciona normal otra vez
    consoleSpy.mockRestore();       // console.log funciona normal otra vez
  });
});

/**
 * RESUMEN DE CONCEPTOS:
 * 
 * 🎭 MOCKS:
 * - "Actores dobles" para funciones
 * - Permiten simular comportamientos específicos
 * - Útiles para probar casos de error sin causar errores reales
 * 
 * 🕵️ SPIES:
 * - "Detectives" que observan funciones
 * - Registran si fueron llamadas, cuántas veces, con qué parámetros
 * - Se pueden combinar con mocks
 * 
 * 🧹 CLEANUP:
 * - Siempre restaurar mocks después de usarlos
 * - Usar beforeEach/afterEach para mantener pruebas independientes
 * - Limpiar archivos/directorios creados durante las pruebas
 * 
 * 📊 COBERTURA:
 * - Medir qué porcentaje del código se ejecuta en las pruebas
 * - Los mocks ayudan a probar casos difíciles de reproducir (como errores)
 * - Objetivo: probar tanto el "happy path" como los casos de error
 */
