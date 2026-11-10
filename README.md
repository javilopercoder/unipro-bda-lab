# UniPRO BDA Lab

Laboratorio de Bases de Datos Avanzadas, desarrollado por módulos y separado de Google Apps Script.

**Estado:** versión de desarrollo. No hay GitHub Pages ni despliegue habilitado. El repositorio permanece privado.

## Módulos

- PostgreSQL: motor real PGlite en el navegador. Editor SQL, consultas guiadas y corrección por resultados.
- MongoDB: simulador local documentado de consultas de documentos (no servidor MongoDB).
- XML/XPath: análisis XML y evaluación XPath mediante APIs nativas del navegador.
- Redis: simulador local de comandos clave-valor.
- Transacciones: simulador didáctico de BEGIN, SAVEPOINT, ROLLBACK y COMMIT.
- Optimización: EXPLAIN real en PGlite, contextualizado.
- Distribuidas: explicación/simulación de particionamiento y filtrado local.
- OLAP y minería: consultas en un esquema estrella y agrupamiento local con datos inventados.

Solo se usan datos ficticios. No existe conexión a los documentos privados de Drive ni a Google Sheets. No se almacenan respuestas de usuarios en ningún servidor.

## Desarrollo

Node.js 22 o superior.

~~~bash
npm install
npm run dev
npm test
npm run build
~~~

Para probar el build: npm run preview.

## Privacidad

GitHub Pages puede publicar un sitio accesible públicamente incluso cuando el repositorio es privado. No se ha configurado un workflow de despliegue. El código no contiene PDF, respuestas reales ni secretos.

## Integración

Una vez probado, se podrá enlazar desde BDA → Entrenar en UniPRO Quiz sin cambiar la API de Apps Script. La integración con V7.4.4 se hará por separado y sin sustituir su arranque.

## Limitaciones conocidas

PGlite ejecuta SQL local compatible con PostgreSQL pero no sustituye un servidor externo ni permite simular de forma auténtica replicación, red o múltiples sesiones remotas. El modo documental interpreta un subconjunto acotado del modelo MongoDB; el modo Redis tampoco es una instancia Redis auténtica. XML se valida únicamente por sintaxis bien formada: no se presenta como validador DTD/XSD. Las simulaciones muestran su naturaleza didáctica en pantalla.
