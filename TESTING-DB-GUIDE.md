# 🧪 Guía Completa: Testing de Operaciones Asíncronas con Bases de Datos

Esta guía te explica todo lo que necesitas saber para probar funciones que interactúan con bases de datos de manera asíncrona.

## 📋 Tabla de Contenidos

- [¿Por qué es diferente probar bases de datos?](#por-qué-es-diferente)
- [Estrategias de Testing](#estrategias)
- [Mocking vs Bases de Datos Reales](#mocking-vs-real)
- [Conceptos de Testing Asíncrono](#conceptos-async)
- [Ejemplos Prácticos](#ejemplos)
- [Mejores Prácticas](#mejores-prácticas)

## 🤔 ¿Por qué es diferente probar bases de datos?

### Desafíos únicos:

1. **Asíncronas**: Las operaciones de BD son promesas
2. **Estado persistente**: Los datos permanecen entre pruebas
3. **Dependencias externas**: Requieren conexión a BD
4. **Errores impredecibles**: Timeouts, conexiones perdidas, etc.
5. **Rendimiento**: Las pruebas pueden ser lentas

## 🎯 Estrategias de Testing

### 1. 🎭 Unit Tests con Mocks (Recomendado para lógica)
```typescript
// ✅ Ventajas
- Rápidas (sin I/O real)
- Predecibles
- Fáciles de configurar
- Testean lógica de negocio

// ❌ Desventajas  
- No prueban BD real
- Pueden no capturar errores de SQL
```

### 2. 🏢 Integration Tests con BD de Pruebas
```typescript
// ✅ Ventajas
- Prueban contra BD real
- Capturan errores de SQL
- Más confianza en el código

// ❌ Desventajas
- Más lentas
- Requieren configuración BD
- Pueden ser frágiles
```

### 3. 🐳 Container Tests (Docker)
```typescript
// ✅ Ventajas
- BD aislada
- Igual que producción
- Reproducible

// ❌ Desventajas
- Requiere Docker
- Configuración compleja
- Aún más lentas
```

## 🎭 Mocking vs Bases de Datos Reales

### Cuándo usar MOCKS:

```typescript
✅ Para probar lógica de negocio
✅ Para simular errores específicos
✅ Para tests unitarios rápidos
✅ Para casos extremos difíciles de reproducir

❌ Para validar SQL real
❌ Para probar constraints de BD
❌ Para validar migraciones
```

### Cuándo usar BD REAL:

```typescript
✅ Para integration tests
✅ Para validar SQL complejo
✅ Para probar transactions
✅ Para validar constraints

❌ Para tests unitarios
❌ Para CI/CD rápido
❌ Para casos de error específicos
```

## ⚡ Conceptos de Testing Asíncrono

### 1. async/await en Tests

```typescript
// ✅ BIEN - Con async/await
test("should create user", async () => {
  const user = await userService.createUser(data);
  expect(user.id).toBeDefined();
});

// ✅ BIEN - Retornando la promesa
test("should create user", () => {
  return userService.createUser(data).then(user => {
    expect(user.id).toBeDefined();
  });
});

// ❌ MAL - Sin manejar la promesa
test("should create user", () => {
  userService.createUser(data); // ¡No espera el resultado!
  expect(true).toBe(true); // Se ejecuta antes que termine createUser
});
```

### 2. Testing de Errores Asíncronos

```typescript
// ✅ Con async/await
test("should handle error", async () => {
  await expect(userService.createUser(invalidData))
    .rejects
    .toThrow("Validation error");
});

// ✅ Con .catch()
test("should handle error", () => {
  return expect(userService.createUser(invalidData))
    .rejects
    .toThrow("Validation error");
});
```

### 3. Mocking de Promesas

```typescript
// Mock que resuelve exitosamente
jest.spyOn(db, "query").mockResolvedValue([user]);

// Mock que falla
jest.spyOn(db, "query").mockRejectedValue(new Error("DB Error"));

// Mock con comportamiento personalizado
jest.spyOn(db, "query").mockImplementation(async (sql) => {
  if (sql.includes("SELECT")) return [user];
  if (sql.includes("INSERT")) return [newUser];
  throw new Error("Unexpected query");
});
```

## 📝 Ejemplos Prácticos

### Ejemplo 1: Test Básico con Mock

```typescript
test("should create user successfully", async () => {
  // ARRANGE
  const userData = { name: "John", email: "john@example.com" };
  const expectedUser = { id: 1, ...userData, createdAt: new Date() };
  
  jest.spyOn(mockDb, "query").mockResolvedValue([expectedUser]);

  // ACT
  const result = await userService.createUser(userData);

  // ASSERT
  expect(result).toEqual(expectedUser);
  expect(mockDb.query).toHaveBeenCalledWith(
    expect.stringContaining("INSERT INTO users"),
    expect.arrayContaining([userData.name, userData.email])
  );
});
```

### Ejemplo 2: Test de Error con Mock

```typescript
test("should handle database error", async () => {
  // ARRANGE
  const userData = { name: "John", email: "john@example.com" };
  
  jest.spyOn(mockDb, "query")
    .mockRejectedValue(new Error("Connection timeout"));
  
  const consoleErrorSpy = jest.spyOn(console, "error")
    .mockImplementation(() => {});

  // ACT & ASSERT
  await expect(userService.createUser(userData))
    .rejects
    .toThrow("Failed to create user: Connection timeout");

  expect(consoleErrorSpy).toHaveBeenCalled();

  // CLEANUP
  consoleErrorSpy.mockRestore();
});
```

### Ejemplo 3: Test con BD Real (Integration)

```typescript
describe("UserService Integration Tests", () => {
  let db: Database;
  let userService: UserService;

  beforeAll(async () => {
    // Conectar a BD de pruebas
    db = await connectToTestDatabase();
    userService = new UserService(db);
  });

  beforeEach(async () => {
    // Limpiar datos antes de cada test
    await db.query("DELETE FROM users");
  });

  afterAll(async () => {
    // Cerrar conexión
    await db.close();
  });

  test("should create and retrieve user", async () => {
    // ACT
    const userData = { name: "John", email: "john@example.com" };
    const createdUser = await userService.createUser(userData);
    const retrievedUser = await userService.getUserById(createdUser.id);

    // ASSERT
    expect(retrievedUser).toEqual(createdUser);
  });
});
```

## 🏆 Mejores Prácticas

### 1. 🧹 Limpieza (Cleanup)

```typescript
// SIEMPRE restaura mocks
afterEach(() => {
  jest.restoreAllMocks();
});

// O manualmente
afterEach(() => {
  querySpy.mockRestore();
  consoleSpy.mockRestore();
});
```

### 2. 📊 Organización de Tests

```typescript
describe("UserService", () => {
  describe("CREATE operations", () => {
    test("should create user successfully", async () => {});
    test("should handle validation errors", async () => {});
    test("should handle database errors", async () => {});
  });

  describe("READ operations", () => {
    test("should get user by id", async () => {});
    test("should return null for non-existent user", async () => {});
  });
});
```

### 3. 🎯 Cobertura Completa

```typescript
// Cubre estos escenarios:
✅ Casos exitosos (happy path)
✅ Casos de error (error path)  
✅ Casos límite (edge cases)
✅ Validaciones de entrada
✅ Manejo de datos vacíos
✅ Timeouts y conexiones perdidas
```

### 4. 📝 Assertions Específicas

```typescript
// ✅ BIEN - Específico
expect(user).toEqual({
  id: expect.any(Number),
  name: "John Doe",
  email: "john@example.com",
  createdAt: expect.any(Date)
});

// ❌ MAL - Demasiado genérico
expect(user).toBeTruthy();
```

### 5. 🔄 Estado Independiente

```typescript
// Cada test debe ser independiente
beforeEach(() => {
  // Configuración fresca para cada test
  mockDb = new MockDatabaseConnection();
  userService = new UserService(mockDb);
});
```

## 🚀 Setup Recomendado

### package.json
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:integration": "jest --testMatch='**/*.integration.test.ts'"
  }
}
```

### jest.config.js
```javascript
module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

## 🎉 Conclusión

**Para empezar:** Usa mocks para tests unitarios rápidos y predecibles.

**Para crecer:** Agrega integration tests con BD real para casos críticos.

**Para escalar:** Considera container tests para pipelines de CI/CD robustos.

**Recuerda:** El objetivo es tener confianza en tu código, no alcanzar 100% de cobertura a cualquier costo.

---

¿Tienes preguntas específicas sobre algún concepto? ¡No dudes en preguntar! 🤓
