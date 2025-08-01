# Testing

## SpyOn y Mock

Ambos son herramientas para controlar el comportamiento de funciones durante las pruebas, pero tienen sus diferencias clas:

- **jest.spyOn() (Espía)**
- Proposito: Observar una funcion existente sin modificar su comportamiento por defecto.
- Caracteristicas:

  - Permite verificar si la funcion fue llamada, con que argumentos, cuantas veces, etc.
  - Puede reemplazar temporalmente la implementación (como un mock) si se usa .mockImplementation().
  - No afecta la funcion origina a menos que se indique explicitamente.

  Ejemplo:

  ```ts
  const consoleSpy = jest.spyOn(console, "log"); // Espía console.log
  console.log("Hola");
  expect(consoleSpy).toHaveBeenCalledWith("Hola");
  consoleSpy.mockRestore(); // Restaura la implementación original
  ```

- **jest.fn() (Mock)**
- Proposito: Crear una función simulada desde cero o reemplazar completamente una existente.
- Caracteristicas:

  - No llama a la funcion real.
  - Permite definir comportamientos personalizados con .mockImplementation()
  - Util para aislar pruebas de dependencias externas (API, BD, etc).
    Ejemplo:

    ```ts
    const mockSave = jest.fn().mockReturnValue(true); // Simula una función
    const result = mockSave();
    expect(result).toBe(true);
    expect(mockSave).toHaveBeenCalled();
    ```

¿Cuando usar cada uno?

| Caso                                           | spyOn                            | mock (jest.fn())  |
| ---------------------------------------------- | -------------------------------- | ----------------- |
| Verificar llamadas a funciones reales          | ✅ si                            | ❌ no             |
| Reemplazar temporalmente una funcion           | ✅ (con .mockImplementation())   | ✅ si             |
| Simular módulos completos                      | ❌ No                            | ✅ Si             |
| Restaurar facilmente la implementacion origina | ✅ Automatico con .mockRestore() | ❌ Debe recrearse |

## Ejemplo SpyOn

```ts
test("should", () => {
  const saveFile = new SaveFile();
  /**
   * El mock/spy es utilizado para simular un error al crear un directorio
   *
   * Crea un espia sobre el metodo mkdirSync del metodo fs
   * Con el objetivo de observar si el metodo es llamado, con que parametros etc.
   *
   * Con .mockImplementation Reemplaza la implementacion original de mkdriSync con que argumentos se llama etc.
   */
  const mkdirSpy = jest.spyOn(fs, "mkdirSync").mockImplementation(() => {
    throw new Error("This is a custom error message from test");
  });

  const result = saveFile.execute(customOptions);
  expect(result).toBe(false);

  mkdirSpy.mockRestore();
});
```
