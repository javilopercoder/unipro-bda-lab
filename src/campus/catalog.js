// Catálogo público de laboratorios originales. No contiene temarios privados.
const original = [
  ["AMD","Álgebra y matemática discreta",1,"apuntes","Lógica · Conjuntos · Matrices · Sistemas lineales","matrix:Operar con matrices:Tema 6;logic:Laboratorio de lógica:Tema 1;graph:Rutas y grafos:Ampliación práctica"],
  ["TEC","Tecnología de computadores",1,"apuntes","Sistemas digitales · Arquitectura · Rendimiento","logic:Puertas y álgebra de Boole:Electrónica digital;architecture:CPU y jerarquía de memoria:Arquitectura"],
  ["FFI","Fundamentos físicos de la informática",1,"apuntes","Electricidad · Campo magnético · Inducción","circuit:Circuitos eléctricos:Tema de corriente y potencia;waves:Campos y señales:Electromagnetismo"],
  ["FPG","Fundamentos de programación",1,"guia","Variables · Algoritmos · Control de flujo","flow:Traza un programa:Variables y bucles;structures:Memoria, pila y cola:Estructuras básicas"],
  ["FEM","Fundamentos de la empresa",1,"guia","Oferta y demanda · Costes · Inversión · Finanzas","breakeven:Punto muerto y costes:Tema 8;cashflow:Tesorería y viabilidad:Tema 9;investment:Evaluación de inversiones (VAN):Tema 10"],
  ["CMN","Cálculo y métodos numéricos",1,"apuntes","Derivadas · Integración · Raíces · Error","calculus:Curvas, derivadas e integrales:Tema 2–6;roots:Busca raíces por bisección:Tema 9"],
  ["EST","Estadística",1,"guia","Probabilidad · Descriptiva · Inferencia","statistics:Muestra y distribución:Estadística descriptiva;montecarlo:Probabilidad con simulación:Probabilidad"],
  ["IPO","Interacción persona-ordenador",1,"guia","Usabilidad · Prototipado · Accesibilidad","fitts:Ley de Fitts y objetivos:Usabilidad;contrast:Contraste accesible:Diseño inclusivo"],
  ["ALC","Algoritmia y complejidad",1,"guia","Notación O · Ordenación · Recorridos","sorting:Carrera de algoritmos:Ordenación y complejidad;graph:Explorador de rutas:Grafos"],
  ["EDA","Estructura de datos",1,"guia","Listas · Pilas · Colas · Árboles","structures:Pilas y colas en vivo:Estructuras lineales;sorting:Coste de operaciones:Algoritmos básicos"],
  ["SO1","Sistemas operativos I",2,"guia","Procesos · Planificación · Memoria","scheduler:Planificador de procesos:Procesos;memory:Paginación y memoria virtual:Memoria"],
  ["RDO","Redes de ordenadores",2,"guia","TCP/IP · Enrutamiento · Subredes","network:Laboratorio de subredes:IPv4;packet:Viaje de un paquete:Latencia y protocolo"],
  ["DYL","Deontología y legislación",2,"apuntes","RGPD · Licencias · Responsabilidad profesional · Seguridad","privacy:Privacidad desde el diseño:Temas 2–3;licenses:Licencias de software y distribución:Tema 7;incident:Respuesta ante una brecha de datos:Temas 3 y 8"],
  ["INS","Ingeniería de software",2,"guia","Diseño · Arquitectura · Calidad","kanban:Flujo de desarrollo:Gestión de ciclo de vida;traceability:Trazabilidad y cobertura:Calidad"],
  ["CYL","Comunicación y liderazgo",2,"apuntes","Comunicación · Motivación · Liderazgo · Cohesión","channels:Selecciona el canal adecuado:Temas 4–5;team:Coordina un equipo:Temas 3 y 6;meeting:Planifica una reunión eficaz:Temas 4 y 7"],
  ["SOA","Sistemas operativos avanzados",2,"apuntes","Linux · Windows · Procesos · Terminal","scheduler:Políticas y concurrencia:Planificación;terminal:Sistema de archivos virtual:Bash y PowerShell"],
  ["PAD","Programación avanzada",2,"alternativa","POO · Excepciones · GUI · Concurrencia","oop:Clases, objetos y herencia:POO;threads:Concurrencia y exclusión mutua:Sincronización"],
  ["GDP","Gestión de proyectos",2,"guia","Planificación · Cronograma · Costes · Riesgos","gantt:Camino crítico y cronograma:Tema 6;earned:Valor ganado (PV, EV, AC):Tema 7;risk:Simulador de riesgos del proyecto:Tema 8"],
  ["ESC","Estructura de computadores",2,"guia","CPU · Cachés · Paralelismo","architecture:Jerarquía de caché:Caché;logic:ALU de 8 bits:Arquitectura digital"],
  ["IAI","Inteligencia artificial e ingeniería del conocimiento",2,"guia","Búsqueda · Representación · Inferencia","graph:Algoritmos de búsqueda:Búsqueda;rules:Motor de reglas:Representación del conocimiento"],
  ["BDD","Bases de datos",2,"guia","Relaciones · Normalización · SQL","relational:Relaciones y dependencias:Modelo relacional;dataset:Explora y transforma registros:Consultas y datos"],
  ["DAA","Diseño avanzado de algoritmos",3,"guia","Grafos · Optimización · Programación dinámica","graph:Dijkstra y caminos mínimos:Grafos;sorting:Analiza el coste:Comparación de algoritmos"],
  ["SSI","Seguridad en los sistemas de información",3,"guia","Criptografía · Autorización · Riesgo","crypto:Hash y cifrado local:Criptografía;access:Políticas de acceso:Control de acceso"],
  ["BDA","Bases de datos avanzadas",3,"apuntes","SQL · XML · NoSQL · Transacciones · OLAP","bda:Laboratorio completo de bases de datos:Temas 1–12;dataset:Generador de datos y calidad:Datos sintéticos"],
  ["INR","Ingeniería de requisitos",3,"guia","Elicitación · Trazabilidad · Validación","traceability:Matriz de trazabilidad:Requisitos;kanban:Gestión de cambios:Flujo de requisitos"],
  ["DAR","Desarrollo de aplicaciones en red",3,"guia","HTTP · Servicios · Cliente-servidor","http:Constructor de peticiones HTTP:Protocolos web;packet:Latencia y reintentos:Comunicación"],
  ["PIS","Procesos de ingeniería del software",3,"guia","Ciclo de vida · DevOps · Integración","pipeline:Pipeline CI/CD:Integración continua;kanban:Kanban de incidencias:Ciclo de desarrollo"],
  ["CAS","Calidad y auditoría de sistemas de información",4,"guia","Pruebas · Auditoría · Indicadores","coverage:Cobertura y mutación:Pruebas;traceability:Evidencias de auditoría:Control y trazabilidad"],
  ["IGR","Informática gráfica y visualización",4,"guia","Geometría · Transformaciones · Imagen","graphics:Transformaciones 2D:Gráficos;calculus:Curvas y aproximaciones:Representación"],
  ["AAM","Aprendizaje automático y minería de datos",4,"guia","Clustering · Regresión · Evaluación","kmeans:Clustering K-means:No supervisado;regression:Regresión y error:Modelos supervisados"]
];
const guide = 'https://www.universidadunipro.com/bachelor-en-ingenieria-informatica-B21.html';
const names = {apuntes:'Basado en apuntes disponibles',guia:'Provisional según guía docente',alternativa:'Referencia de otro bachelor (provisional)'};
export const SUBJECTS = original.map(([id,name,year,source,topics,list])=>({
 id,name,year,source,sourceLabel:names[source],topics:topics.split(' · '),guide,
 labs:list.split(';').map((row,index)=>{const [type,title,topic]=row.split(':');return {id:id.toLowerCase()+'-'+(index+1),type,title,topic,description:'Práctica original e interactiva · '+topic}})
}));
export const YEARS = [{id:1,label:'Primer curso'},{id:2,label:'Segundo curso'},{id:3,label:'Tercer curso'},{id:4,label:'Optativas'}];
export const TOTAL_LABS=SUBJECTS.reduce((sum,s)=>sum+s.labs.length,0);
// La hoja de UniPRO Quiz usa otros códigos en siete materias. Conservar las rutas antiguas evita perder enlaces y progreso.
export const QUIZ_CODE_ALIASES=Object.freeze({FPR:'FPG',AYC:'ALC',EDD:'EDA',PRA:'PAD',EDC:'ESC',IGV:'IGR',AMD2:'AAM'});
export const quizToLabSubject=id=>QUIZ_CODE_ALIASES[id]||id;
export const getSubject=(id)=>SUBJECTS.find(s=>s.id===quizToLabSubject(id));
export const getLab=(id)=>SUBJECTS.flatMap(s=>s.labs.map(l=>({...l,subjectId:s.id,subject:s.name}))).find(l=>l.id===id);
