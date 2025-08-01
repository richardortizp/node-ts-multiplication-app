# Estrategia de Testing para MongoDB con Mongoose y PostgreSQL con PG

Aquí te presento las mejores prácticas para testear aplicaciones que interactúan con bases de datos MongoDB utilizando Mongoose y con bases de datos PostgreSQL utilizando la librería `pg`.

## Índice

- [MongoDB con Mongoose](#mongodb-con-mongoose)
- [PostgreSQL con `pg`](#postgresql-con-pg)
- [Uso de Docker para Testing](#uso-de-docker-para-testing)
- [Ejemplos Prácticos Explicados](#ejemplos-prácticos-explicados)

## MongoDB con Mongoose

### Estrategias de Testing

1. **Unit Testing con Mocks**
   - Mocks para simular operaciones de base de datos.
   - No requieren conexión a una base de datos real.
   - Útiles para probar validaciones y lógica de negocio.

2. **Integration Testing con Base de Datos en Memoria**
   - Usar `mongodb-memory-server` para crear instancias de MongoDB en memoria.
   - Verifica que las consultas y las operaciones se ejecutan correctamente.
   - No requiere configuración manual de un servidor MongoDB.

3. **E2E Testing con Base de Datos Real**
   - Usar Docker para correr una instancia real de MongoDB.
   - Pruebas desde el frontend hasta la base de datos.

## PostgreSQL con `pg`

### Estrategias de Testing

1. **Unit Testing con Mocks**
   - Mocks para simular operaciones SQL usando `jest`.
   - Simulan respuestas del servidor Postgres.

2. **Integration Testing con Docker y Base de Datos Real**
   - Correr PostgreSQL en un contenedor Docker.
   - Preparar base de datos con datos de prueba antes de cada test.
   
3. **E2E Testing**
   - Verificar toda la cadena de transacciones, incluyendo APIs REST.

## Uso de Docker para Testing

### Ventajas

- Aislamiento completo de la base de datos.
- Reproducible: mismo setup en cualquier ambiente.
- Facilita la integración continua, compatible con CI/CD.

### Ejemplo de Docker Compose para MongoDB y PostgreSQL

```yaml
db-mongo:
  image: mongo:latest
  ports:
    - "27017:27017"

postgres:
  image: postgres:latest
  environment:
    POSTGRES_USER: user
    POSTGRES_PASSWORD: password
    POSTGRES_DB: testdb
  ports:
    - "5432:5432"
```

Ejecuta `docker-compose up -d` para iniciar las bases de datos en contenedores.

## Ejemplos Prácticos Explicados

### MongoDB con Mongoose

#### Unit Test
- **Descripción**: Utilizar mocks para simular interacciones con el modelo `User`.
- **Propósito**: Verificar validaciones de schema.

#### Integration Test
- **Descripción**: Usar `mongodb-memory-server` para iniciar MongoDB en memoria.
- **Propósito**: Comprobar la ejecución de queries.

### PostgreSQL con `pg`

#### Unit Test
- **Descripción**: Simular conexiones y respuestas de la base de datos.
- **Propósito**: Probar la lógica de negocio sin acceder a PostgreSQL.

#### Integration Test
- **Descripción**: Usar Docker para ejecutar PostgreSQL real.
- **Propósito**: Validar operaciones SQL completas.

## Conclusión

**Testing efectivo**: Comienza con pruebas unitarias usando mocks, luego avanza a pruebas de integración para asegurar la integridad de las operaciones con la base de datos real.

Para preparar tu ambiente de desarrollo, asegúrate de tener Docker instalado y configurado correctamente. Esto te dará un ambiente controlado y replicable para todas tus pruebas.

