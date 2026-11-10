// Ampliaciones didácticas originales. Conservar IDs iniciales para no perder el progreso.
// Cada fila: motor | título | tema | misión práctica | comprobación de interacción.
const rows = {
  "AMD": [
    [
      "matrix",
      "Determinantes con Sarrus",
      "Matrices 3×3",
      "Modifica la primera celda a 9 y comprueba cómo cambia el determinante.",
      "m0=9"
    ],
    [
      "logic",
      "Construye un XOR",
      "Lógica binaria",
      "Elige XOR y configura A como 12 y B como 7.",
      "op=XOR&a=12&b=7"
    ],
    [
      "graph",
      "Rutas ponderadas",
      "Grafos",
      "Selecciona Dijkstra y encuentra el camino de A hasta G.",
      "algo=dijkstra&end=G&@next=1"
    ]
  ],
  "TEC": [
    [
      "logic",
      "Bits y máscara AND",
      "Operaciones binarias",
      "Aplica AND a los valores 170 y 15 para conservar solo los bits compartidos.",
      "op=AND&a=170&b=15"
    ],
    [
      "architecture",
      "Caché L1 con alto rendimiento",
      "Arquitectura",
      "Lleva la tasa de acierto de L1 al 98 % y observa el tiempo medio.",
      "l1=98"
    ],
    [
      "logic",
      "Inversor de ocho bits",
      "Electrónica digital",
      "Aplica NOT sobre A=170 y observa la inversión de sus ocho bits.",
      "op=NOT&a=170"
    ],
    [
      "architecture",
      "Cuello de botella en RAM",
      "Jerarquía de memoria",
      "Sube el acceso a RAM a 250 ns y baja los aciertos L1 al 70 %.",
      "ram=250&l1=70"
    ]
  ],
  "FFI": [
    [
      "circuit",
      "Resistencias en paralelo",
      "Circuitos",
      "Selecciona paralelo, R1=20 Ω y R2=20 Ω para calcular la equivalente.",
      "mode=parallel&r1=20&r2=20"
    ],
    [
      "circuit",
      "¿Qué ocurre al duplicar voltaje?",
      "Ley de Ohm",
      "Ajusta la fuente a 24 V y compara potencia e intensidad.",
      "V=24"
    ],
    [
      "waves",
      "Campo y distancia al cuadrado",
      "Campo eléctrico",
      "Aumenta la distancia a 6 m y observa la caída del campo.",
      "r=6"
    ],
    [
      "waves",
      "Fuerza magnética y ángulo",
      "Electromagnetismo",
      "Elige 90° para obtener el máximo valor relativo de sin(θ).",
      "theta=90"
    ]
  ],
  "FPG": [
    [
      "flow",
      "Suma acumulada hasta N",
      "Bucles",
      "Configura 10 iteraciones y ejecuta dos pasos del programa.",
      "max=10&@next=2"
    ],
    [
      "structures",
      "Pila LIFO",
      "Estructuras lineales",
      "Selecciona pila, añade dos valores y extrae uno.",
      "kind=stack&@push=2&@pop=1"
    ],
    [
      "structures",
      "Cola FIFO",
      "Estructuras lineales",
      "Selecciona cola, añade dos valores y extrae el primero.",
      "kind=queue&@push=2&@pop=1"
    ],
    [
      "logic",
      "Condiciones binarias",
      "Operadores lógicos",
      "Elige OR y configura A=1 y B=2.",
      "op=OR&a=1&b=2"
    ]
  ],
  "FEM": [
    [
      "breakeven",
      "Precio y margen comercial",
      "Costes variables",
      "Configura precio 80 € y coste variable 30 €; observa el nuevo umbral.",
      "price=80&variable=30"
    ],
    [
      "cashflow",
      "Proyección de caja a dos años",
      "Finanzas",
      "Lleva el horizonte a 24 meses y observa cuándo se agota la caja.",
      "months=24"
    ],
    [
      "investment",
      "Descuento del 15 %",
      "Valor del dinero",
      "Configura tasa anual de descuento del 15 %.",
      "rate=15"
    ]
  ],
  "CMN": [
    [
      "calculus",
      "Pendiente de una curva",
      "Derivadas",
      "Configura a=2 y x=2. Observa el cambio de pendiente.",
      "a=2&x=2"
    ],
    [
      "roots",
      "Precisión por bisección",
      "Métodos numéricos",
      "Ejecuta cuatro iteraciones de bisección para acotar la raíz.",
      "@step=4"
    ],
    [
      "calculus",
      "Aproximación de integrales",
      "Integración",
      "Aumenta las particiones a 100 para comparar resultado y error.",
      "n=100"
    ],
    [
      "regression",
      "Ajuste lineal y ruido",
      "Aproximación numérica",
      "Lleva el ruido a 7 y analiza cómo varía R².",
      "noise=7"
    ]
  ],
  "EST": [
    [
      "statistics",
      "Distribución con media negativa",
      "Estadística descriptiva",
      "Establece media teórica -5 y 5.000 observaciones.",
      "mean=-5&size=5000"
    ],
    [
      "statistics",
      "Dispersión de una muestra",
      "Varianza y desviación",
      "Establece dispersión 12 y observa la desviación calculada.",
      "spread=12"
    ],
    [
      "montecarlo",
      "Lanzamientos de moneda",
      "Probabilidad",
      "Configura un dado de dos caras y 10.000 ensayos.",
      "sides=2&size=10000"
    ],
    [
      "regression",
      "Correlación con ruido",
      "Correlación",
      "Establece ruido 9 y compara R² con una muestra menos ruidosa.",
      "noise=9"
    ]
  ],
  "IPO": [
    [
      "fitts",
      "Objetivos pequeños difíciles",
      "Usabilidad",
      "Reduce el tamaño del objetivo a 20 px y practica su selección.",
      "width=20&@start=1"
    ],
    [
      "contrast",
      "Contraste entre dos colores",
      "Accesibilidad",
      "Modifica los dos colores para comprobar su relación de contraste.",
      "@input:fg=1&@input:bg=1"
    ],
    [
      "fitts",
      "Objetivos lejanos",
      "Interacción",
      "Aumenta la distancia a 400 px y activa el objetivo.",
      "distance=400&@start=1"
    ],
    [
      "kanban",
      "Prototipo en revisión",
      "Diseño centrado en personas",
      "Avanza una tarjeta desde la primera columna del tablero.",
      "@button=1"
    ]
  ],
  "ALC": [
    [
      "sorting",
      "Burbuja paso a paso",
      "Ordenación",
      "Selecciona burbuja y avanza cinco comparaciones.",
      "method=bubble&@step=5"
    ],
    [
      "sorting",
      "Ordenación por inserción",
      "Complejidad",
      "Selecciona inserción y avanza tres pasos.",
      "method=insertion&@step=3"
    ],
    [
      "graph",
      "Búsqueda BFS",
      "Grafos",
      "Configura BFS, salida A y destino G; avanza dos nodos.",
      "algo=bfs&@next=2"
    ],
    [
      "graph",
      "Comparación BFS y Dijkstra",
      "Rutas",
      "Elige Dijkstra y avanza tres nodos de exploración.",
      "algo=dijkstra&@next=3"
    ]
  ],
  "EDA": [
    [
      "structures",
      "Cola de impresión",
      "Colas",
      "Coloca dos trabajos en la cola y extrae el primero.",
      "kind=queue&@push=2&@pop=1"
    ],
    [
      "structures",
      "Historial con pila",
      "Pilas",
      "Usa una pila, inserta tres eventos y retrocede uno.",
      "kind=stack&@push=3&@pop=1"
    ],
    [
      "sorting",
      "Coste de comparaciones",
      "Vectores",
      "Avanza seis comparaciones del método burbuja.",
      "method=bubble&@step=6"
    ],
    [
      "memory",
      "Reemplazo de páginas como cola",
      "Estructuras y memoria",
      "Selecciona FIFO, tres marcos, y avanza cinco referencias.",
      "policy=FIFO&frames=3&@step=5"
    ]
  ],
  "SO1": [
    [
      "scheduler",
      "Round Robin con quantum corto",
      "Planificación",
      "Selecciona Round Robin con quantum 1.",
      "policy=RR&quantum=1"
    ],
    [
      "scheduler",
      "Shortest Job First",
      "Planificación",
      "Selecciona SJF y compara los tiempos medios.",
      "policy=SJF"
    ],
    [
      "memory",
      "FIFO con memoria limitada",
      "Paginación",
      "Selecciona FIFO, dos marcos y avanza cuatro referencias.",
      "policy=FIFO&frames=2&@step=4"
    ],
    [
      "memory",
      "LRU con más marcos",
      "Memoria virtual",
      "Selecciona LRU, cinco marcos y avanza seis referencias.",
      "policy=LRU&frames=5&@step=6"
    ]
  ],
  "RDO": [
    [
      "network",
      "Subred /26",
      "Direcciones IPv4",
      "Escribe 192.168.10.42 y selecciona /26; calcula hosts utilizables.",
      "ip=192.168.10.42&cidr=26&@calc=1"
    ],
    [
      "network",
      "Subred /30",
      "Enlaces punto a punto",
      "Cambia el prefijo a /30 y recalcula la red.",
      "cidr=30&@calc=1"
    ],
    [
      "packet",
      "Más saltos, más retardo",
      "Latencia",
      "Fija 12 saltos y 30 ms por salto.",
      "hops=12&lat=30"
    ],
    [
      "packet",
      "Pérdida y reintentos",
      "Transporte",
      "Eleva la pérdida estimada al 20 % y observa el tiempo esperado.",
      "loss=20"
    ]
  ],
  "DYL": [
    [
      "privacy",
      "Principio de minimización",
      "Protección de datos",
      "Activa recogida mínima e información clara a interesados.",
      "min=true&notice=true"
    ],
    [
      "licenses",
      "Copyleft y redistribución",
      "Licencias",
      "Elige GPL y distribución sin código fuente para revisar consecuencias.",
      "dep=gpl&distribution=closed"
    ],
    [
      "incident",
      "Respuesta a las 80 horas",
      "Seguridad y normativa",
      "Fija 80 horas y un riesgo potencialmente alto.",
      "hours=80&risk=high"
    ]
  ],
  "INS": [
    [
      "kanban",
      "Control de cambios en el equipo",
      "Métodos ágiles",
      "Avanza dos tarjetas hacia el trabajo en curso.",
      "@button=2"
    ],
    [
      "traceability",
      "Requisito sin pruebas",
      "Trazabilidad",
      "Modifica dos relaciones en la matriz de requisitos.",
      "@input=2"
    ],
    [
      "pipeline",
      "Build, test y despliegue",
      "Integración continua",
      "Mueve una tarea dos veces por las etapas del pipeline.",
      "@button=2"
    ],
    [
      "coverage",
      "Cobertura funcional",
      "Pruebas",
      "Activa dos relaciones entre requisitos y sus casos de prueba.",
      "@input=2"
    ]
  ],
  "CYL": [
    [
      "channels",
      "Comunicación de urgencia",
      "Comunicación",
      "Configura urgencia 10 y complejidad 2; compara el mejor canal.",
      "urgent=10&complex=2"
    ],
    [
      "team",
      "Reducir sobrecarga",
      "Liderazgo",
      "Baja la sobrecarga a 2 y sube la confianza a 8.",
      "load=2&trust=8"
    ],
    [
      "meeting",
      "Reunión breve",
      "Trabajo colaborativo",
      "Reduce duración a 30 min y prepara el reparto del tiempo.",
      "duration=30"
    ]
  ],
  "SOA": [
    [
      "terminal",
      "Crear archivos de proyecto",
      "Shell",
      "Crea un directorio con mkdir y un archivo con touch en la terminal virtual.",
      "@run=2"
    ],
    [
      "scheduler",
      "Prioridades de CPU",
      "Procesos",
      "Selecciona SJF y compara con FCFS.",
      "policy=SJF"
    ],
    [
      "memory",
      "Paginación LRU",
      "Memoria avanzada",
      "Selecciona LRU y avanza ocho accesos.",
      "policy=LRU&@step=8"
    ],
    [
      "terminal",
      "Copiar y mover archivos",
      "Sistemas de archivos",
      "Ejecuta cuatro comandos en el sistema de archivos de práctica.",
      "@run=4"
    ]
  ],
  "PAD": [
    [
      "oop",
      "Polimorfismo de objetos",
      "Programación orientada a objetos",
      "Selecciona Bicicleta, instancia y llama a mover().",
      "class=Bicicleta&@instantiate=1&@call=1"
    ],
    [
      "threads",
      "Condición de carrera",
      "Concurrencia",
      "Avanza dos instrucciones sin bloqueo.",
      "@next=2"
    ],
    [
      "threads",
      "Exclusión mutua",
      "Sincronización",
      "Activa el mutex y avanza dos operaciones.",
      "mutex=true&@next=2"
    ],
    [
      "flow",
      "Seguimiento de bucles",
      "Depuración",
      "Configura N=12 y ejecuta tres pasos.",
      "max=12&@next=3"
    ]
  ],
  "GDP": [
    [
      "gantt",
      "Dependencias y holgura",
      "Camino crítico",
      "Cambia la duración de una tarea del cronograma.",
      "@input=1"
    ],
    [
      "earned",
      "Proyecto con retrasos",
      "Valor ganado",
      "Establece avance real 40 % y coste 60.000 €.",
      "complete=40&spent=60000"
    ],
    [
      "risk",
      "Riesgo técnico elevado",
      "Gestión de riesgos",
      "Aumenta probabilidad de fallo técnico al 75 %.",
      "p1=75"
    ]
  ],
  "ESC": [
    [
      "architecture",
      "Tasa de fallos en caché",
      "Memoria",
      "Reduce aciertos L1 al 55 % y observa la penalización.",
      "l1=55"
    ],
    [
      "logic",
      "Operación NAND en ALU",
      "CPU",
      "Aplica NAND a A=85 y B=15.",
      "op=NAND&a=85&b=15"
    ],
    [
      "architecture",
      "Tiempo de acceso a RAM",
      "Jerarquía de caché",
      "Configura RAM con 200 ns de acceso.",
      "ram=200"
    ],
    [
      "logic",
      "Suma 8 bits y desbordamiento",
      "ALU",
      "Suma A=255 y B=2 para observar el resultado de 8 bits.",
      "op=ADD&a=255&b=2"
    ]
  ],
  "IAI": [
    [
      "rules",
      "Inferencia hacia adelante",
      "Sistemas expertos",
      "Activa fiebre y tos, y ejecuta el motor de reglas.",
      "fever=true&cough=true&@infer=1"
    ],
    [
      "graph",
      "Búsqueda por amplitud",
      "Búsqueda informada y no informada",
      "Selecciona BFS y recorre tres nodos.",
      "algo=bfs&@next=3"
    ],
    [
      "graph",
      "Costes en búsqueda",
      "Búsqueda",
      "Selecciona Dijkstra y avanza cuatro nodos.",
      "algo=dijkstra&@next=4"
    ],
    [
      "kmeans",
      "Agrupamiento no supervisado",
      "Minería e IA",
      "Cambia a cuatro clusters y ejecuta dos iteraciones.",
      "k=4&@step=2"
    ]
  ],
  "BDD": [
    [
      "relational",
      "INNER JOIN y cardinalidad",
      "Modelo relacional",
      "Selecciona INNER JOIN y ejecútalo.",
      "join=inner&@run=1"
    ],
    [
      "relational",
      "LEFT JOIN y ausencias",
      "Consultas",
      "Selecciona LEFT JOIN para incluir clientes sin pedidos.",
      "join=left"
    ],
    [
      "dataset",
      "Filtra por región",
      "Tratamiento de datos",
      "Selecciona región Sur y un mínimo de 200 €.",
      "region=Sur&min=200"
    ],
    [
      "dataset",
      "Exportación de registros",
      "Consultas y datos",
      "Genera 12.000 ventas y exporta un CSV.",
      "size=12000&@download=1"
    ]
  ],
  "DAA": [
    [
      "graph",
      "Camino mínimo ponderado",
      "Optimización",
      "Selecciona Dijkstra y destino G.",
      "algo=dijkstra&end=G"
    ],
    [
      "graph",
      "BFS frente a grafos con pesos",
      "Grafos",
      "Selecciona BFS y avanza cuatro nodos.",
      "algo=bfs&@next=4"
    ],
    [
      "sorting",
      "Algoritmos por inserción",
      "Ordenación",
      "Selecciona inserción y avanza ocho operaciones.",
      "method=insertion&@step=8"
    ],
    [
      "roots",
      "Convergencia del método",
      "Algoritmos iterativos",
      "Ejecuta seis pasos y observa el intervalo.",
      "@step=6"
    ]
  ],
  "SSI": [
    [
      "crypto",
      "Efecto avalancha en hash",
      "Integridad",
      "Modifica el mensaje y vuelve a calcular SHA-256.",
      "@input:message=1&@hash=1"
    ],
    [
      "access",
      "Mínimo privilegio",
      "RBAC",
      "Desactiva dos permisos y observa la matriz.",
      "@input=2"
    ],
    [
      "privacy",
      "Salvaguardas del tratamiento",
      "Seguridad y privacidad",
      "Activa cifrado, minimización e información al interesado.",
      "encrypt=true&min=true&notice=true"
    ],
    [
      "incident",
      "Respuesta a incidentes",
      "Gestión de seguridad",
      "Marca contenidas y preservadas las evidencias.",
      "contain=true&evidence=true"
    ]
  ],
  "BDA": [
    [
      "bda",
      "PostgreSQL: consultas y rendimiento",
      "Laboratorio SQL",
      "Abre el módulo PostgreSQL y ejecuta la consulta guiada.",
      ""
    ],
    [
      "bda",
      "MongoDB: documentos y agregaciones",
      "Tema 10 · NoSQL",
      "Abre el modo documental y prueba una agregación.",
      ""
    ],
    [
      "bda",
      "XML y XPath prácticos",
      "Temas 2–3",
      "Abre el modo XML, selecciona nodos y comprueba XPath.",
      ""
    ],
    [
      "bda",
      "Transacciones y recuperación",
      "Tema 7–8",
      "Abre el simulador de transacciones, cambia el saldo y haz rollback.",
      ""
    ]
  ],
  "INR": [
    [
      "traceability",
      "Rastreo de cambios",
      "Trazabilidad",
      "Activa tres enlaces requisito-caso de prueba.",
      "@input=3"
    ],
    [
      "coverage",
      "Requisitos sin prueba",
      "Cobertura",
      "Desactiva una relación y observa el impacto.",
      "@input=1"
    ],
    [
      "kanban",
      "Cambios en el alcance",
      "Gestión de requisitos",
      "Mueve una tarea de cambios a revisión.",
      "@button=2"
    ],
    [
      "channels",
      "Entrevista con interesados",
      "Elicitación",
      "Configura complejidad 9 y cinco participantes.",
      "complex=9&people=5"
    ]
  ],
  "DAR": [
    [
      "http",
      "Respuesta HTTP y códigos",
      "REST",
      "Selecciona DELETE y envía una petición simulada.",
      "method=DELETE&@send=1"
    ],
    [
      "http",
      "Crear recurso con POST",
      "APIs",
      "Selecciona POST sobre la ruta de estudiantes.",
      "method=POST&@send=1"
    ],
    [
      "packet",
      "Pérdida de red",
      "Aplicaciones distribuidas",
      "Lleva la pérdida a 15 % y los saltos a 10.",
      "loss=15&hops=10"
    ],
    [
      "network",
      "Direcciones de servicio",
      "IPv4",
      "Introduce 10.0.0.15 y prefijo /28.",
      "ip=10.0.0.15&cidr=28"
    ]
  ],
  "PIS": [
    [
      "pipeline",
      "Interrupción de pipeline",
      "Calidad y entregas",
      "Activa pruebas fallidas e intenta avanzar una tarea.",
      "fail=true&@button=1"
    ],
    [
      "kanban",
      "Limitar trabajo en curso",
      "Flujo",
      "Mueve dos tareas hacia «En curso».",
      "@button=2"
    ],
    [
      "traceability",
      "Cambios y pruebas",
      "Gestión de procesos",
      "Cambia dos relaciones en la matriz.",
      "@input=2"
    ],
    [
      "earned",
      "Avance frente a coste",
      "Seguimiento de proyectos",
      "Configura avance 60 % y gasto de 50.000 €.",
      "complete=60&spent=50000"
    ]
  ],
  "CAS": [
    [
      "coverage",
      "Cobertura de requisitos",
      "Pruebas",
      "Cambia tres casillas para comparar cobertura.",
      "@input=3"
    ],
    [
      "traceability",
      "Evidencias por requisito",
      "Auditoría",
      "Relaciona dos requisitos con pruebas.",
      "@input=2"
    ],
    [
      "access",
      "Revisión de permisos RBAC",
      "Auditoría de seguridad",
      "Cambia dos permisos de una matriz de acceso.",
      "@input=2"
    ],
    [
      "pipeline",
      "Pruebas bloqueantes",
      "Calidad",
      "Activa pruebas fallidas y avanza un cambio.",
      "fail=true&@button=1"
    ]
  ],
  "IGR": [
    [
      "graphics",
      "Rotación de un triángulo",
      "Transformaciones 2D",
      "Gira la figura 90 grados.",
      "angle=90"
    ],
    [
      "graphics",
      "Escalado y traslación",
      "Geometría",
      "Elige escala 150 % y traslada en X=60.",
      "scale=150&dx=60"
    ],
    [
      "calculus",
      "Curvas y tangentes",
      "Gráficos",
      "Elige a=-2 y x=2 para transformar la curva.",
      "a=-2&x=2"
    ],
    [
      "contrast",
      "Paletas legibles",
      "Visualización accesible",
      "Cambia ambos colores y comprueba su contraste.",
      "@input:fg=1&@input:bg=1"
    ]
  ],
  "AAM": [
    [
      "kmeans",
      "K-means con cinco clusters",
      "Clustering",
      "Elige K=5 y ejecuta cuatro iteraciones.",
      "k=5&@step=4"
    ],
    [
      "regression",
      "Regresión con ruido bajo",
      "Regresión supervisada",
      "Fija ruido 0 y observa R².",
      "noise=0"
    ],
    [
      "regression",
      "Pendiente negativa",
      "Regresión",
      "Fija pendiente -3 y compara el ajuste.",
      "slope=-3"
    ],
    [
      "statistics",
      "Distribuciones para entrenamiento",
      "Preparación de datos",
      "Genera 10.000 muestras con media 8.",
      "size=10000&mean=8"
    ]
  ]
};
export const EXTRA_LABS=Object.fromEntries(Object.entries(rows).map(([id,arr])=>[id,arr.map(([type,title,topic,challenge,verify])=>({type,title,topic,challenge,verify:verify||'',difficulty:'Práctica guiada'}))]));
export function validateExtraFor(subjects){const missing=subjects.filter(s=>!EXTRA_LABS[s.id]);if(missing.length)throw Error('Sin ampliación para: '+missing.map(x=>x.id).join(', '));return subjects.reduce((n,s)=>n+EXTRA_LABS[s.id].length,0)}
