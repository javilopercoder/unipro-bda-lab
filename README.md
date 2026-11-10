# UniPRO BDA Lab

Laboratorio interactivo de Bases de Datos Avanzadas, vinculado conceptualmente a UniPRO Quiz.

> **Estado: rama de desarrollo, sin publicar.** El repositorio es privado y no hay GitHub Pages activado.

## Tecnologías y experiencias

- **SQL y PostgreSQL:** PGlite ejecuta SQL real en el navegador. Nueve retos de lectura, JOIN, GROUP BY, HAVING, CTE, funciones ventana, Data Warehouse e interpretación de EXPLAIN.
- **MongoDB (simulador):** filtrar documentos, proyectar campos y agregar datos. Admite un subconjunto limitado de operaciones, no un servidor MongoDB real.
- **XML/XPath (real):** edición de XML y consulta XPath del navegador. No valida DTD ni XSD.
- **Redis (simulador):** SET, GET, DEL, INCR, EXPIRE, TTL y otros comandos clave-valor.
- **Transacciones (simulador):** BEGIN, SAVEPOINT, transferencias, ROLLBACK, COMMIT y fallo simulado.
- **Planes de ejecución:** EXPLAIN real de PostgreSQL sobre un dataset pequeño.
- **OLAP y minería:** agrupaciones de ventas y segmentación por umbrales (no K-Means real).
- **Bases distribuidas (simulador):** comparación pedagógica de filas transferidas con y sin filtrado en origen.

La interfaz indica siempre qué es motor real y qué es simulación didáctica. Las prácticas utilizan datos inventados; **no acceden a las preguntas de Google Sheets ni a los apuntes privados**.

## Desarrollo

Necesitas Node.js 22 o superior.

    npm install
    npm test
    npm run dev

Compilar:

    npm run build
    npm run preview

El build está diseñado para un servidor estático, pero no se ha activado ningún despliegue.

## Privacidad y publicación

El repositorio privado **no garantiza que el sitio GitHub Pages sea privado**. Si se activa Pages, el contenido desplegado normalmente será público. No incluyas API keys, datos personales, soluciones privadas ni PDF originales en el repositorio.

## Integración prevista con UniPRO Quiz

Cuando la versión de prueba funcione y se decida alojarla, se añadirá un acceso desde BDA → Entrenar. No hemos modificado todavía V7.4.4 de Apps Script ni su hoja de datos.

## Limitaciones importantes

La corrección SQL compara filas y columnas del resultado en una base de datos pequeña; no certifica rendimiento ni ausencia de trampas en cualquier SQL. Los intérpretes documentales y de Redis no sustituyen instancias reales. En XML solo se controla sintaxis bien formada y XPath. La recuperación WAL, la replicación y el paralelismo reales exigen infraestructura que no se implementa aquí.
