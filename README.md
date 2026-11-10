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
