// Mini-guías para la consola BDA, sin depender del campus.
const GUIDES={
  "sql": {
    "title": "SQL: pregunta a una base de datos",
    "what": "Una consulta SELECT pide filas y columnas. WHERE filtra, JOIN relaciona tablas, GROUP BY agrupa y HAVING filtra grupos.",
    "steps": [
      "Ejemplo distinto del reto: SELECT nombre FROM clientes LIMIT 5;",
      "SELECT elige la columna; FROM señala la tabla; LIMIT evita mostrar miles de filas.",
      "El resultado contiene hasta cinco nombres. Después puedes añadir tu propio filtro."
    ],
    "hints": [
      "Empieza por SELECT: qué columnas quieres.",
      "Escribe FROM con la tabla correspondiente.",
      "Si necesitas condiciones sobre filas, añade WHERE."
    ],
    "mistake": "WHERE filtra filas antes de agrupar; HAVING filtra grupos después."
  },
  "mongo": {
    "title": "Documentos: encuentra y agrupa JSON",
    "what": "MongoDB guarda documentos flexibles. En este simulador puedes probar una parte de find y aggregate sin instalar un servidor.",
    "steps": [
      "Empieza explorando: db.clientes.find({})",
      "Las llaves vacías significan que todavía no aplicas ningún filtro.",
      "Prueba después una condición propia para reducir los documentos devueltos."
    ],
    "hints": [
      "Comprueba el nombre de la colección: clientes.",
      "Utiliza JSON válido, con comillas dobles en claves y texto.",
      "Para sumar documentos por ciudad, usa un pipeline con $group."
    ],
    "mistake": "El simulador no es MongoDB completo. Solo admite operadores implementados explícitamente."
  },
  "xml": {
    "title": "XML y XPath desde cero",
    "what": "XML representa datos anidados mediante elementos y atributos. XPath permite seleccionar nodos mediante rutas.",
    "steps": [
      "Ejemplo: <paciente><prioridad>alta</prioridad></paciente>.",
      "La ruta //prioridad localiza esos elementos en cualquier profundidad.",
      "//prioridad/text() recupera sus textos, como alta. Prueba tú la ruta de otros campos."
    ],
    "hints": [
      "Empieza por observar las etiquetas XML.",
      "// busca en cualquier profundidad; / sigue una ruta directa.",
      "@ permite extraer un atributo, como @codigo."
    ],
    "mistake": "Un XML bien formado no significa necesariamente que cumpla un esquema DTD/XSD."
  },
  "redis": {
    "title": "Clave-valor: escribe y consulta",
    "what": "Un almacén clave-valor asocia identificadores con datos. Redis es un motor real, pero aquí utilizas un simulador local de sus comandos básicos.",
    "steps": [
      "Ejemplo: SET curso Informática.",
      "GET curso devuelve Informática.",
      "DEL curso elimina esa clave; después GET devuelve nil."
    ],
    "hints": [
      "Usa SET clave valor para empezar.",
      "Recupera con GET clave.",
      "Para contadores enteros existe INCR."
    ],
    "mistake": "GET no devuelve el valor si la clave expiró o fue eliminada."
  },
  "transactions": {
    "title": "Transacciones: confirmado o deshecho",
    "what": "Una transacción agrupa cambios y permite confirmar con COMMIT o revertir con ROLLBACK. SAVEPOINT crea puntos intermedios de recuperación.",
    "steps": [
      "Empieza con Ana=1000 € y Luis=500 €.",
      "BEGIN y transferir 100 € dejan cambios provisionales: 900 y 600.",
      "ROLLBACK los descarta; COMMIT los confirma."
    ],
    "hints": [
      "Pulsa BEGIN antes de modificar.",
      "Usa SAVEPOINT para crear un punto intermedio.",
      "Comprueba la diferencia entre COMMIT y ROLLBACK."
    ],
    "mistake": "Esta interfaz es una simulación educativa; no mide concurrencia real ni implementa WAL de PostgreSQL."
  },
  "plans": {
    "title": "Planes: cómo decide buscar PostgreSQL",
    "what": "EXPLAIN muestra una estimación de los pasos que el motor utilizaría para ejecutar una consulta. Una tabla pequeña puede recorrerse completa sin que sea un fallo.",
    "steps": [
      "Ejemplo independiente: EXPLAIN SELECT * FROM pedidos WHERE importe > 200;",
      "El plan describe qué operaciones estima hacer el motor.",
      "Compara el coste y los operadores con otra consulta que propongas."
    ],
    "hints": [
      "Escribe EXPLAIN antes de SELECT.",
      "Localiza el operador principal del plan.",
      "Distingue coste estimado de tiempo real medido."
    ],
    "mistake": "EXPLAIN básico no ejecuta la consulta y no da el rendimiento real de un sistema con millones de filas."
  },
  "analytics": {
    "title": "OLAP: explora dimensiones y medidas",
    "what": "Un modelo analítico resume hechos (ventas) por dimensiones (región, tiempo, producto). OLAP permite cambiar el nivel de detalle.",
    "steps": [
      "Tres ventas: Centro 20 €, Centro 30 €, Sur 10 €.",
      "Agrupar por región da Centro 50 € y Sur 10 €.",
      "Cambiar a producto cambia la pregunta sin alterar las filas originales."
    ],
    "hints": [
      "Identifica la medida que quieres sumar.",
      "Elige la dimensión por la que agrupar.",
      "Compara distintos niveles y dimensiones."
    ],
    "mistake": "Una segmentación por umbrales no es K-means: son técnicas distintas."
  },
  "distributed": {
    "title": "Distribución y pushdown",
    "what": "En sistemas distribuidos importa qué datos viajan entre nodos. Pushdown significa realizar filtros cerca del origen para evitar trasladar filas innecesarias.",
    "steps": [
      "Hay 1000 filas, de las que 100 corresponden a Centro.",
      "Sin filtrar en origen podrían viajar 1000 filas.",
      "Con pushdown solo viajarían 100; los valores aquí son ficticios."
    ],
    "hints": [
      "Elige una región.",
      "Desactiva el filtro remoto y observa filas transferidas.",
      "Vuelve a activarlo y compara."
    ],
    "mistake": "El contador no mide tráfico de red real ni reproduce un cluster distribuido."
  }
};
const escapeHTML=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
export const BDA_GUIDES=GUIDES;
export function renderBdaGuide(main,mode){
 const guide=GUIDES[mode];if(!guide)return;
 const el=document.createElement('section');el.className='bda-guide';el.setAttribute('aria-label','Aprende con un ejemplo');
 const example=guide.steps.map((x,i)=>'<li data-guide-step="'+i+'" class="'+(i===0?'is-current':'')+'"><b>'+(i+1)+'.</b> '+escapeHTML(x)+'</li>').join('');
 el.innerHTML='<div class="bda-guide-heading"><span>UNA IDEA, UN EJEMPLO</span><h2>'+escapeHTML(guide.title)+'</h2></div><p>'+escapeHTML(guide.what)+'</p>'+
 '<div class="bda-guide-example"><div class="bda-example-head"><h3>Así funciona</h3><span id="bda-guide-counter">1 / 3</span></div><ol>'+example+'</ol><nav class="bda-example-nav" aria-label="Pasos del ejemplo"><button id="bda-step-prev" type="button" class="btn secondary">← Anterior</button><button id="bda-step-next" type="button" class="btn">Siguiente paso →</button></nav></div>'+
 '<div class="bda-guide-actions"><button id="bda-hint-next" type="button" class="btn secondary">Necesito una pista</button></div><div id="bda-guide-hints" aria-live="polite"></div>'+
 '<details><summary>Lo que suele confundirse</summary><p>'+escapeHTML(guide.mistake)+'</p></details>';
 const heading=main.querySelector('.heading');if(heading)heading.insertAdjacentElement('afterend',el);else main.prepend(el);
 let active=0,hintCount=0;
 const steps=[...el.querySelectorAll('[data-guide-step]')],previous=el.querySelector('#bda-step-prev'),next=el.querySelector('#bda-step-next');
 const draw=()=>{
  steps.forEach((x,i)=>{x.classList.toggle('is-current',i===active);x.setAttribute('aria-hidden',String(i!==active))});
  el.querySelector('#bda-guide-counter').textContent=(active+1)+' / '+steps.length;
  previous.disabled=active===0;
  next.textContent=active===steps.length-1?'Volver al principio ↻':'Siguiente paso →';
 };
 previous.onclick=()=>{active=Math.max(0,active-1);draw()};
 next.onclick=()=>{active=(active+1)%steps.length;draw()};
 draw();
 el.querySelector('#bda-hint-next').onclick=()=>{
  if(hintCount>=guide.hints.length)return;
  const p=document.createElement('p');p.textContent='Pista '+(hintCount+1)+': '+guide.hints[hintCount];
  el.querySelector('#bda-guide-hints').append(p);hintCount++;
  if(hintCount>=guide.hints.length)el.querySelector('#bda-hint-next').disabled=true;
 };
}
