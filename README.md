# UniPRO Lab · Campus interactivo

**Proyecto no oficial de prácticas del Bachelor en Informática (UniPRO).**

26 asignaturas técnicas, 53 laboratorios de interacción directa, sin cuestionarios tipo test ni calificaciones. Excluye el TFG y materias no técnicas. Las tres optativas técnicas están incluidas, sujetas a oferta académica.

## Arquitectura

- Portada: \`index.html\` → \`src/main.js\` → \`src/campus/*\`.
- BDA original: \`bda.html\` → \`src/bda-main.js\` (se conserva el laboratorio anterior).
- PostgreSQL: PGlite (WebAssembly) únicamente al abrir BDA.
- Resto: motores locales JavaScript y SVG, sin cuentas, claves ni servidor de datos.
- Progreso: localStorage del navegador. No se sincroniza entre dispositivos ni se envía a Google Sheets.

## Qué se puede practicar

Álgebra (matrices, lógica), tecnología (ALU, jerarquía de caché), física (circuitos y campos), programación (trazas, estructuras, objetos y concurrencia), cálculo (derivadas, integrales, bisección), estadística (muestreo y Monte Carlo), UX (Fitts y accesibilidad), algoritmos (ordenación, BFS y Dijkstra), sistemas operativos (planificación, memoria, sistema de archivos virtual), redes (subredes y latencia), IA (reglas y búsqueda), bases de datos (PGlite, consultas, XML, documento, OLAP y datos sintéticos), requisitos (trazabilidad), ingeniería (Kanban y CI/CD), seguridad (SHA-256 y permisos), visualización (transformaciones 2D) y aprendizaje automático (K-means, regresión).

Todas las simulaciones sin infraestructura real se identifican como tales. Los ejercicios son originales. Los documentos privados de Drive no se han copiado al código.

### Base académica

Plan del Bachelor: https://www.universidadunipro.com/bachelor-en-ingenieria-informatica-B21.html

Para las materias con apuntes disponibles en el proyecto se han usado sus áreas temáticas verificadas; para las demás, la guía pública orienta los ejemplos provisionales. Programación Avanzada utiliza como referencia provisional una guía de otro bachelor: https://cms.unir.net/upbcida10_programacion_avanzada

Estas prácticas no sustituyen el material oficial ni certifican el aprendizaje.

## Desarrollar

Node.js 22 o superior:

    npm install
    npm test
    npm run build
    npm run dev

Las pruebas de navegador requieren Playwright:

    npx playwright install chromium
    npm run test:e2e

El build produce \`dist/index.html\` (campus) y \`dist/bda.html\` (laboratorio BDA anterior). Vercel debe usar framework Vite, comando \`npm run build\` y directorio \`dist\`.

## Privacidad y seguridad

El repositorio puede ser privado, pero el sitio desplegado en Vercel será públicamente accesible salvo que se configure protección. No insertar información privada en el código ni en los datasets. Ningún formulario ejecuta shell real ni consulta datos de producción.

## Limitaciones

Los simuladores de procesos, red, criptografía aplicada, sistemas distribuidos, caché y minería son didácticos, no sustituyen sistemas reales. Estadísticas y modelos se basan en datos sintéticos. Un laboratorio se marca como practicado al interactuar con él; no implica haberlo dominado ni corregido.


## Apariencia y volúmenes de datos

- 🌞/🌙 El selector permite alternar entre modo claro y oscuro desde cualquier página, incluido \`bda.html\`. Se recuerda la elección en el navegador y, sin elección previa, se utiliza la preferencia del sistema.
- **PostgreSQL real (PGlite):** 1.205 clientes, 6.007 pedidos, 64 productos y 8.006 ventas sintéticas (15.282 filas en total).
- **MongoDB simulado:** 2.505 documentos ficticios en la colección \`clientes\`.
- **OLAP y distribución:** 4.007 operaciones de venta, con agrupaciones y simulaciones de traslado de filas.
- **Generador de ventas del campus:** hasta 20.000 registros filtrables y exportables a CSV.
- **Otras actividades:** K-means (150 puntos iniciales), regresión (100 observaciones), estadística (hasta 20.000 observaciones), algoritmos y procesos con ejemplos de tamaño didáctico.
- Los datos ampliados son reproducibles y nunca proceden de sistemas reales. El editor SQL solo admite consultas permitidas. Los simuladores de MongoDB/Redis no son servidores reales.
