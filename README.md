# Node-ts-multiplication-app

## Intrucciones para correr y ejecutar nuestro programa

1. Instalar dependencias

```shell
npm i
```

2. Ejecutar proyecto
   - Banderas obligatorias:
   * **--base** o **--b**: Que representa la tabla la cual se generará.
   * **--limit** o **--b**: Que representa hasta que multiplicador llegará la tabla.
   * **--show** o **--s**: Que define si el resultado de la tabla se muetra en consola o no.
   * **--name** o **--n**: Nombre de mi archivo a generar.
   * **--destination** o **--d**: Directorio de destino del archivo generado.
     -- **--extension** o **--ex**: Extension del archivo generado.

```shell
npx ts-node src/app.ts --base 4 --limit 10 --s --d "outputs/tables" --n "tabla-del-4" --ex "txt"
```
