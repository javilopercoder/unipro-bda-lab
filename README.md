# Laboratorio interactivo

Un espacio independiente para aprender informática practicando, con motores y datos sintéticos ejecutados en el navegador.

## Recorrido

El catálogo ofrece 30 áreas de estudio y 180 prácticas. Cada práctica comienza con una idea breve, un ejemplo resuelto paso a paso y un reto. Incluye pistas progresivas, comprobación interactiva y explicaciones ampliadas si las necesitas.

La interfaz está diseñada para no exigir conocimientos previos ni obligar a leer grandes bloques antes de probar. El aprendizaje se construye desde ejemplos hasta experimentos autónomos. El progreso se guarda localmente y distingue entre exploración y misión realizada. No son calificaciones ni certificados.

## Bases de datos

La página \`bda.html\` incluye PostgreSQL en PGlite (ejecución local real) y módulos didácticos de XML/XPath, documentos, clave-valor, transacciones, planes de ejecución, OLAP y distribución. Los simuladores están identificados; no son servidores externos ni sistemas de producción.

PostgreSQL incluye 15.282 filas entre clientes, pedidos, productos y ventas ficticias. El módulo documental utiliza 2.505 documentos sintéticos y el módulo OLAP 4.007 operaciones.

## Organización

- \`src/campus/catalog.js\`: materias, prácticas, rutas y alias.
- \`src/campus/curriculum.js\`: objetivos específicos de cada experiencia.
- \`src/campus/lessons.js\`: conceptos, ejemplos y pistas.
- \`src/campus/academy.js\`: interfaz de aprendizaje y comprobación de misiones.
- \`src/campus/matrix-lab.js\`: taller visual de matrices 3×3 con Sarrus.
- \`src/campus/math.js\`, \`computing.js\`, \`applied.js\` y \`management.js\`: motores de simulación.
- \`src/campus/bda-guides.js\`: guías interactivas para los ocho modos de bases de datos.

## Ejecutar

Con Node.js 22 o superior:

\`\`\`bash
npm install
npm test
npm run build
npx playwright install chromium
npm run test:e2e
\`\`\`

Vite compila \`index.html\` y \`bda.html\` en \`dist\`. Se puede desplegar en cualquier hosting estático con rutas relativas.

## Alcance y limitaciones

Los ejemplos son originales y no están vinculados a ninguna institución. Algunos contenidos se apoyan en la estructura temática de planes académicos públicos, pero no reproducen documentos docentes. Las actividades son didácticas: una simulación de seguridad, cumplimiento, redes o arquitectura no sustituye sistemas reales ni asesoramiento profesional. El progreso no se sincroniza entre dispositivos.

Licencias de terceros: consultar \`package.json\` y sus dependencias.


## Consolas y editores libres

Esta versión recupera la interacción directa con la consola y elimina las soluciones precargadas en las prácticas de código.

- **Sistema de archivos ficticio:** línea de comandos dentro del terminal, historial con flechas ↑/↓, autocompletado de nombres de comandos con Tab y Enter para ejecutar. Admite pwd, ls, cd, mkdir, touch, cat, write, echo, cp, mv, rm, tree, clear, whoami e history. Los archivos no salen de la memoria del navegador.
- **SQL/PostgreSQL (PGlite):** consulta en editor vacío, ejecución libre, verificación opcional de los retos y salida en la misma consola. Ctrl/Cmd+Enter ejecuta. Las tablas usan datos sintéticos.
- **MongoDB:** expresión sin plantilla inicial; find, proyección y aggregate son un subconjunto interpretado localmente, no un servidor MongoDB.
- **XML/XPath:** documento de ejemplo modificable y expresión XPath inicialmente vacía.
- **Redis:** línea de comandos integrada en su propia consola, historial y comando HELP; almacenamiento aislado en la sesión.
- **Algoritmos:** editor de pseudocódigo sin programa precargado, intérprete con sintaxis limitada (asignación, aritmética, for/range, print), visualización de variables y ejecución paso a paso. No ejecuta Python completo ni código arbitrario.
- **Clases:** editor de definiciones de método mover() con un subconjunto limitado de sintaxis similar a JavaScript; modifica el comportamiento de los objetos simulados. No ejecuta JavaScript arbitrario.
- **Pistas:** tres etapas de ayuda disponibles bajo demanda. En terminales y editores se muestran fragmentos del comando o la consulta que el alumno puede insertar, nunca ejecutar automáticamente. Los retos son opcionales.
- **Parámetros:** cada slider numérico puede ajustarse con ratón o escribiendo el valor; los parámetros técnicos disponen de una ayuda contextual opcional.

Los ejercicios no impiden explorar fuera de una misión. La ejecución libre no se considera una calificación ni certifica dominio del temario. Los motores de simulación están identificados como tales y no conectan con servicios o bases de datos externos.

## Comprobación

Los tests incluyen consultas con editores vacíos, comandos y operaciones de archivos, pistas progresivas, creación de métodos, pseudocódigo, controles editables, terminales en móvil y rutas anteriores.
