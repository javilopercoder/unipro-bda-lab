# UniPRO Lab · Campus interactivo

**Proyecto no oficial de prácticas del Bachelor en Informática (UniPRO).**

30 asignaturas del plan de estudios, 180 laboratorios de interacción directa, sin cuestionarios tipo test ni calificaciones. Excluye solo el Trabajo Final de Bachelor. Las tres optativas técnicas están incluidas, sujetas a oferta académica.

## Arquitectura

- Portada: \`index.html\` → \`src/main.js\` → \`src/campus/*\`.
- BDA original: \`bda.html\` → \`src/bda-main.js\` (se conserva el laboratorio anterior).
- PostgreSQL: PGlite (WebAssembly) únicamente al abrir BDA.
- Resto: motores locales JavaScript y SVG, sin cuentas, claves ni servidor de datos.
- Progreso: localStorage del navegador. Se distingue entre actividad explorada y misión interactiva realizada; no es una calificación, no se sincroniza entre dispositivos y no se envía a Sheets.

## Qué se puede practicar

Fundamentos de empresa (punto muerto, caja y VAN), gestión de proyectos (camino crítico, valor ganado y riesgos), comunicación y liderazgo (canal de comunicación, coordinación y reuniones), deontología (protección de datos, licencias y respuesta a incidentes), Álgebra (matrices, lógica), tecnología (ALU, jerarquía de caché), física (circuitos y campos), programación (trazas, estructuras, objetos y concurrencia), cálculo (derivadas, integrales, bisección), estadística (muestreo y Monte Carlo), UX (Fitts y accesibilidad), algoritmos (ordenación, BFS y Dijkstra), sistemas operativos (planificación, memoria, sistema de archivos virtual), redes (subredes y latencia), IA (reglas y búsqueda), bases de datos (PGlite, consultas, XML, documento, OLAP y datos sintéticos), requisitos (trazabilidad), ingeniería (Kanban y CI/CD), seguridad (SHA-256 y permisos), visualización (transformaciones 2D) y aprendizaje automático (K-means, regresión).

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


## Integración con UniPRO Quiz

Se puede entrar a cada asignatura mediante `/#/asignatura/ID`. El banco de UniPRO Quiz utiliza IDs diferentes en siete materias: `FPR→FPG`, `AYC→ALC`, `EDD→EDA`, `PRA→PAD`, `EDC→ESC`, `IGV→IGR`, `AMD2→AAM`. El catálogo mantiene estas rutas como alias y no cambia los identificadores de progreso antiguos. La V7.4.6 del proyecto UniPRO Quiz integra todos los enlaces, pero debe instalarse y probarse por separado en Apps Script.

## Materias transversales añadidas

- **Fundamentos de la empresa:** costes y umbral de rentabilidad (tema 8), tesorería y finanzas (tema 9), VAN e inversiones (tema 10).
- **Deontología y legislación:** privacidad y principios de tratamiento (temas 2 y 3), licencias y contratos informáticos (tema 7), respuesta operativa a brechas (temas 3 y 8).
- **Comunicación y liderazgo:** elección de canales y mensajes (temas 4 y 5), coordinación de equipos (temas 3 y 6), preparación de reuniones y seguimiento (temas 4 y 7).
- **Gestión de proyectos:** cronogramas y camino crítico (tema 6), valor ganado (tema 7), simulación de riesgos (tema 8).

Los ejemplos son originales. Las reglas de decisión de licencias, protección de datos o gestión de personas son modelos didácticos; **no proporcionan dictámenes legales, evaluaciones psicológicas ni certificaciones profesionales**.

Guías oficiales de estas materias:
- https://cms.unir.net/upbinfo05_fundempresa
- https://cms.unir.net/upbinfo13_deontologia
- https://cms.unir.net/upbinfo15_comu_y_liderazgo
- https://cms.unir.net/upbinfo18_gestionproyectos

## Itinerarios guiados para principiantes

Cada una de las **180 prácticas** incluye una introducción con lenguaje sencillo, un ejemplo resuelto en tres pasos, una misión concreta, tres pistas que se revelan de manera progresiva, un error habitual y una pregunta para razonar sobre el resultado. Los **48 tipos de motor** tienen una microlección propia; el BDA independiente incorpora guías para sus ocho modos.

El objetivo es que un estudiante que nunca ha abierto los apuntes sepa qué está viendo y qué debe hacer antes de manipular controles. La misión se valida mediante estados y acciones observables, sin pretender certificar comprensión conceptual; se distingue expresamente de las calificaciones.

La ampliación añade 115 prácticas a las 65 anteriores y conserva todos sus identificadores, rutas y progreso. Hay **seis prácticas por asignatura**, excluyendo el TFG. Las prácticas basadas solo en guías públicas siguen marcadas como provisionales hasta disponer de los apuntes originales.

**Nuevos archivos:** `src/campus/curriculum.js` (retos), `src/campus/lessons.js` (explicaciones y ejemplos), `src/campus/academy.js` (pistas, comprobación y recorrido), `src/campus/bda-guides.js` (ayudas de los ocho módulos de BDA). Las prácticas se ejecutan localmente en el navegador; no es necesario migrar Apps Script para utilizarlas.
