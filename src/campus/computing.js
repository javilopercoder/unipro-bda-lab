// Sistemas, algoritmos y estructuras de datos. Modelos locales, sin shell ni red real.
const $=(root,selector)=>selector===undefined?document.querySelector(root):root.querySelector(selector);
const n=(r,s)=>Number($(r,s).value);
const f=(x,d=2)=>Number(x).toFixed(d);
function base(root,description,controls=''){root.innerHTML='<p class="lab-intro">'+description+'</p><div class="controls">'+controls+'</div><div class="output-card" id="lab-output"></div><div class="visual-card" id="lab-viz"></div>';return{$out:$('#lab-output'),$viz:$('#lab-viz')}}
const slider=(id,label,min,max,v,step=1)=>'<label class="control">'+label+' <b data-value="'+id+'">'+v+'</b><input id="'+id+'" type="range" min="'+min+'" max="'+max+'" value="'+v+'" step="'+step+'"></label>';
const action=(id,text)=>'<button type="button" id="'+id+'" class="btn">'+text+'</button>';
const pick=(id,options)=>'<select id="'+id+'">'+options.map(([v,l])=>'<option value="'+v+'">'+l+'</option>').join('')+'</select>';
const escape=x=>String(x).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const nodes=['A','B','C','D','E','F','G'];const edges=[['A','B',4],['A','C',2],['B','D',5],['B','E',1],['C','B',1],['C','E',8],['C','F',7],['D','G',1],['E','D',2],['E','G',5],['F','G',2]];
function shortest(start,end,algo){const dist=Object.fromEntries(nodes.map(x=>[x,Infinity])),prev={},queue=[start],visited=[],seen=new Set;dist[start]=0;while(queue.length){if(algo==='dijkstra')queue.sort((a,b)=>dist[a]-dist[b]);const v=queue.shift();if(seen.has(v))continue;seen.add(v);visited.push(v);if(v===end)break;for(const [a,b,w]of edges){if(a!==v)continue;if(algo==='bfs'&&!seen.has(b)&&!queue.includes(b)){queue.push(b);prev[b]=v;dist[b]=dist[v]+1}else if(algo==='dijkstra'&&dist[v]+w<dist[b]){dist[b]=dist[v]+w;prev[b]=v;queue.push(b)}}}const path=[];for(let cur=end;cur!=null&&Number.isFinite(dist[cur]);cur=prev[cur]){path.unshift(cur);if(cur===start)break}return {dist:dist[end],path:path[0]===start?path:[],visited}}
export function renderComputing(root,lab){
 const t=lab.type;
 if(t==='graph'){
 const { $out,$viz }=base(root,'Recorre un grafo dirigido con pesos. BFS minimiza saltos; Dijkstra minimiza la suma de los pesos.', '<label class="control">Inicio '+pick('start',nodes.map(x=>[x,x]))+'</label><label class="control">Destino '+pick('end',nodes.map(x=>[x,x]))+'</label><label class="control">Algoritmo '+pick('algo',[['dijkstra','Dijkstra'],['bfs','BFS']])+'</label>'+action('next','Avanzar exploración'));
 $('#end').value='G';const pos={A:[45,105],B:[160,45],C:[160,170],D:[355,55],E:[310,140],F:[310,225],G:[535,125]};let step=0;const update=()=>{const res=shortest($('#start').value,$('#end').value,$('#algo').value),shown=res.visited.slice(0,step),path=res.path;const chosen=new Set(path.slice(1).map((x,i)=>path[i]+'-'+x));$out.innerHTML='<strong>Camino: '+path.join(' → ')+'</strong><p>Coste ('+($('#algo').value==='bfs'?'saltos':'pesos')+'): '+res.dist+' · explorados: '+shown.join(', ')+'</p>'; $viz.innerHTML='<svg viewBox="0 0 590 270" role="img" aria-label="Grafo dirigido con pesos">'+edges.map(([a,b,w])=>{const [x1,y1]=pos[a],[x2,y2]=pos[b];return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+(chosen.has(a+'-'+b)?'#16a34a':'#94a3b8')+'" stroke-width="'+(chosen.has(a+'-'+b)?4:2)+'"/><text x="'+((x1+x2)/2)+'" y="'+((y1+y2)/2-7)+'" font-size="13" fill="currentColor">'+w+'</text>'}).join('')+nodes.map(v=>'<circle cx="'+pos[v][0]+'" cy="'+pos[v][1]+'" r="20" fill="'+(shown.includes(v)?'#16a34a':path.includes(v)?'#bfdbfe':'#e2e8f0')+'"/><text x="'+pos[v][0]+'" y="'+(pos[v][1]+5)+'" text-anchor="middle" font-weight="700" fill="#1e293b">'+v+'</text>').join('')+'</svg>'};
 ['start','end','algo'].forEach(id=>$('#'+id).onchange=()=>{step=0;update()});$('#next').onclick=()=>{step++;update()};update();return;
 }
 if(t==='sorting'){
 const { $out,$viz }=base(root,'Ordena barras observando comparaciones e intercambios. Elige el algoritmo y avanza un paso cada vez.', '<label class="control">Método '+pick('method',[['bubble','Burbuja'],['insertion','Inserción']])+'</label>'+action('step','Siguiente paso')+action('restart','Nueva colección'));
 let arr=[],steps=[],i=0,seed=123;function generate(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;arr=Array.from({length:14},(_,j)=>9+((seed+j*37+j*j*19)%90));const values=[...arr];steps=[{values:[...values],a:-1,b:-1,comp:0,swaps:0}];let comp=0,swaps=0;if($('#method').value==='bubble'){for(let p=0;p<values.length-1;p++)for(let j=0;j<values.length-p-1;j++){comp++;let a=j,b=j+1;if(values[a]>values[b]){[values[a],values[b]]=[values[b],values[a]];swaps++}steps.push({values:[...values],a,b,comp,swaps})}}else{for(let p=1;p<values.length;p++){let j=p;while(j>0){comp++;if(values[j]>=values[j-1])break;[values[j],values[j-1]]=[values[j-1],values[j]];swaps++;steps.push({values:[...values],a:j,b:j-1,comp,swaps});j--}}}i=0;draw()}
 function draw(){const s=steps[i];$out.innerHTML='<strong>Paso '+i+' de '+(steps.length-1)+'</strong><p>Comparaciones: '+s.comp+' · Intercambios: '+s.swaps+'</p>';$viz.innerHTML='<div class="bars">'+s.values.map((x,j)=>'<div title="'+x+'" class="bar '+(j===s.a||j===s.b?'active':'')+'" style="height:'+x+'%"></div>').join('')+'</div>'}
 $('#method').onchange=generate;$('#step').onclick=()=>{i=Math.min(i+1,steps.length-1);draw()};$('#restart').onclick=generate;generate();return;
 }
 if(t==='structures'){
 const { $out,$viz }=base(root,'Manipula una pila (LIFO) o una cola (FIFO). Observa dónde entran y salen los elementos.', '<label class="control">Estructura '+pick('kind',[['stack','Pila'],['queue','Cola']])+'</label><label class="control">Dato <input id="value" type="text" maxlength="20" value="42"></label>'+action('push','Añadir')+action('pop','Extraer')+action('clear','Vaciar'));
 let arr=[];function draw(last=''){const type=$('#kind').value;$out.textContent=(last?last+' · ':'')+(type==='stack'?'LIFO: sale el último elemento añadido.':'FIFO: sale el primer elemento añadido.')+' Elementos: '+arr.length;$viz.innerHTML='<div class="structure-row">'+arr.map((x,i)=>'<span class="structure-node">'+escape(x)+'<small>'+i+'</small></span>').join('')+'</div><p class="subtle">Inicio ← estructura → final</p>'}
 $('#kind').onchange=()=>{arr=[];draw()};$('#push').onclick=()=>{if(arr.length>=30)return draw('Capacidad didáctica máxima: 30');arr.push($('#value').value||'dato');draw('Elemento añadido')};$('#pop').onclick=()=>draw('Sale: '+(arr.length?($('#kind').value==='queue'?arr.shift():arr.pop()):'estructura vacía'));$('#clear').onclick=()=>{arr=[];draw()};draw();return;
 }
 if(t==='scheduler'){
 const processes=[{id:'P1',arrival:0,burst:7},{id:'P2',arrival:2,burst:4},{id:'P3',arrival:4,burst:1},{id:'P4',arrival:5,burst:4}];
 const { $out,$viz }=base(root,'Compara FCFS, SJF no expulsivo y Round Robin sobre los mismos procesos. Modifica el quantum para ver cambios en la espera.', '<label class="control">Planificador '+pick('policy',[['FCFS','FCFS'],['SJF','SJF no expulsivo'],['RR','Round Robin']])+'</label>'+slider('quantum','Quantum RR',1,8,2));
 function run(){
 const pol=$('#policy').value,quantum=n(root,'#quantum'),jobs=processes.map(p=>({...p,remaining:p.burst})),blocks=[],finish={};
 let time=0;
 if(pol==='RR'){
  const incoming=[...jobs].sort((a,b)=>a.arrival-b.arrival),queue=[];
  let cursor=0,guard=0;
  const arrived=()=>{while(cursor<incoming.length&&incoming[cursor].arrival<=time)queue.push(incoming[cursor++])};
  while(Object.keys(finish).length<jobs.length&&guard++<100){
   arrived();if(!queue.length){time=incoming[cursor].arrival;arrived()}
   const p=queue.shift(),duration=Math.min(quantum,p.remaining);
   blocks.push({id:p.id,from:time,to:time+duration});time+=duration;p.remaining-=duration;
   arrived();if(p.remaining>0)queue.push(p);else finish[p.id]=time;
  }
 }else{
  let guard=0;
  while(Object.keys(finish).length<jobs.length&&guard++<50){
   const available=jobs.filter(p=>p.arrival<=time&&p.remaining>0);
   if(!available.length){time=Math.min(...jobs.filter(p=>p.remaining>0).map(p=>p.arrival));continue}
   available.sort((a,b)=>pol==='FCFS'?a.arrival-b.arrival:a.burst-b.burst||a.arrival-b.arrival);
   const p=available[0];blocks.push({id:p.id,from:time,to:time+p.remaining});time+=p.remaining;p.remaining=0;finish[p.id]=time;
  }
 }
 const waits=processes.map(p=>({id:p.id,wait:finish[p.id]-p.arrival-p.burst,turnaround:finish[p.id]-p.arrival}));
 $out.innerHTML='<strong>Espera media: '+f(waits.reduce((a,b)=>a+b.wait,0)/waits.length)+' · retorno medio: '+f(waits.reduce((a,b)=>a+b.turnaround,0)/waits.length)+'</strong><p>'+waits.map(x=>x.id+': '+x.wait+' de espera').join(' · ')+'</p>';
 $viz.innerHTML='<div class="gantt">'+blocks.map(b=>'<div class="gantt-cell" style="flex:'+Math.max(1,b.to-b.from)+'" title="'+b.id+': '+b.from+'–'+b.to+'">'+b.id+'<small>'+b.from+'–'+b.to+'</small></div>').join('')+'</div><p class="subtle">Procesos: '+processes.map(p=>p.id+' (llegada '+p.arrival+', duración '+p.burst+')').join(', ')+'</p>';
 }
 $('#policy').onchange=run;$('#quantum').oninput=run;run();return;
 }
 if(t==='memory'){
 const pages=[7,0,1,2,0,3,0,4,2,3,0,3,2,1,2,0,1,7,0,1],{ $out,$viz }=base(root,'Observa los aciertos y fallos de página con FIFO o LRU y un número ajustable de marcos.', '<label class="control">Sustitución '+pick('policy',[['FIFO','FIFO'],['LRU','LRU']])+'</label>'+slider('frames','Marcos físicos',2,6,3)+action('step','Referencia siguiente')+action('reset','Reiniciar'));
 let i=0,frames=[],age=[],hits=0,faults=0;function reset(){i=0;frames=[];age=[];hits=faults=0;draw()}function draw(){const x=pages[i]??'fin';$out.innerHTML='<strong>Referencia '+i+' / '+pages.length+': '+x+'</strong><p>Fallos: '+faults+' · aciertos: '+hits+' · tasa de fallos: '+f(i?faults/i*100:0)+' %</p>';$viz.innerHTML='<div class="structure-row">'+Array.from({length:n(root,'#frames')},(_,j)=>'<span class="structure-node">'+(frames[j]??'—')+'</span>').join('')+'</div><p class="subtle">Secuencia: '+pages.join(' → ')+'</p>'}
 $('#step').onclick=()=>{if(i>=pages.length)return;const p=pages[i];if(frames.includes(p)){hits++;if($('#policy').value==='LRU')age[frames.indexOf(p)]=i}else{faults++;if(frames.length<n(root,'#frames')){frames.push(p);age.push(i)}else{const j=age.indexOf(Math.min(...age));frames[j]=p;age[j]=i}}i++;draw()};$('#policy').onchange=reset;$('#frames').oninput=reset;$('#reset').onclick=reset;reset();return;
 }
 if(t==='network'){
 const { $out,$viz }=base(root,'Introduce una IPv4 y un prefijo CIDR. Calcula red, máscara, broadcast y tamaño de subred.', '<label class="control">Dirección IPv4 <input id="ip" value="192.168.10.42" inputmode="decimal"></label>'+slider('cidr','Prefijo CIDR',8,30,24)+action('calc','Calcular'));
 function ipnum(ip){const a=ip.split('.');if(a.length!==4||a.some(s=>! /^\d{1,3}$/.test(s)||Number(s)>255))throw Error('Dirección IPv4 incorrecta.');return a.reduce((v,s)=>((v<<8)|Number(s))>>>0,0)}
 const ipstr=x=>[24,16,8,0].map(n=>(x>>>n)&255).join('.');
 function calculate(){try{const bits=n(root,'#cidr'),ip=ipnum($('#ip').value),mask=(0xffffffff<<(32-bits))>>>0,network=(ip&mask)>>>0,broadcast=(network|(~mask))>>>0;const hosts=(2**(32-bits))-2;$out.innerHTML='<strong>Red '+ipstr(network)+'/'+bits+'</strong><p>Máscara: '+ipstr(mask)+' · broadcast: '+ipstr(broadcast)+'</p><p>Hosts utilizables: '+hosts.toLocaleString('es-ES')+' · rango: '+ipstr(network+1)+' a '+ipstr(broadcast-1)+'</p>';$viz.innerHTML='<div class="bit-row">'+ip.toString(2).padStart(32,'0').split('').map((x,i)=>'<span class="bit '+(i<bits?'on':'')+'">'+x+'</span>').join('')+'</div>'}catch(e){$out.textContent=e.message;$viz.textContent=''}}$('#calc').onclick=calculate;$('#cidr').oninput=calculate;calculate();return;
 }
 if(t==='packet'){
 const { $out,$viz }=base(root,'Modela latencia de una comunicación. Modifica saltos, tamaño, ancho de banda y pérdida estimada.',slider('hops','Saltos',1,15,5)+slider('size','Tamaño (KB)',1,1000,128)+slider('bw','Ancho de banda (Mbps)',1,1000,100)+slider('lat','Latencia por salto (ms)',1,100,15)+slider('loss','Pérdida (%)',0,30,2));
 function calc(){const h=n(root,'#hops'),kb=n(root,'#size'),bw=n(root,'#bw'),delay=n(root,'#lat'),loss=n(root,'#loss')/100,tx=kb*8/bw,network=h*delay,base=network+tx;const p=Math.pow(1-loss,h),exp=base/Math.max(p,.01);$out.innerHTML='<strong>Tiempo sin pérdidas: '+f(base)+' ms</strong><p>Transmisión: '+f(tx)+' ms · saltos: '+f(network)+' ms</p><p>Probabilidad de llegar sin pérdida por salto: '+f(p*100)+' % · tiempo esperado simplificado con reintentos: '+f(exp)+' ms</p>';$viz.innerHTML='<div class="packet-route">'+Array.from({length:h+1},(_,i)=>'<span class="route-node">'+(i===0?'Cliente':i===h?'Servidor':'R'+i)+'</span>').join('<span class="route-arrow">→</span>')+'</div>'}root.querySelectorAll('input').forEach(x=>x.oninput=calc);calc();return;
 }
 if(t==='architecture'){
 const { $out,$viz }=base(root,'La jerarquía de memoria cambia el tiempo de acceso promedio. Prueba diferentes tasas de acierto.',slider('l1','Aciertos L1 (%)',50,99,90)+slider('l2','Aciertos L2 en fallos L1 (%)',30,99,80)+slider('t1','Acceso L1 (ns)',1,10,2)+slider('t2','Acceso L2 (ns)',5,50,15)+slider('ram','Acceso RAM (ns)',40,300,100));
 function update(){const a=n(root,'#l1')/100,b=n(root,'#l2')/100,t=n(root,'#t1')+(1-a)*(n(root,'#t2')+(1-b)*n(root,'#ram'));$out.innerHTML='<strong>Tiempo medio de acceso: '+f(t,2)+' ns</strong><p>Fallo L1: '+f((1-a)*100,2)+' % · fallo global L1/L2: '+f((1-a)*(1-b)*100,2)+' %</p>';$viz.innerHTML='<div class="cache-levels"><span>L1</span><span>L2</span><span>RAM</span></div>'};root.querySelectorAll('input').forEach(x=>x.oninput=update);update();return;
 }
 if(t==='threads'){
 const { $out,$viz }=base(root,'Dos hilos incrementan un contador compartido. Comprueba cómo aparece una actualización perdida cuando las operaciones no son atómicas.', '<label class="control"><input type="checkbox" id="mutex"> Usar exclusión mutua</label>'+action('next','Siguiente instrucción')+action('restart','Reiniciar'));
 let step=0;const instructions=[['Hilo A','leer x=0'],['Hilo B','leer x=0'],['Hilo A','escribir x=1'],['Hilo B','escribir x=1']];function draw(){const lock=$('#mutex').checked,number=lock?Math.min(step,2):step>=4?1:step>=3?1:0;$out.innerHTML='<strong>Contador compartido: '+number+'</strong><p>'+ (lock?'Con bloqueo, los dos incrementos terminan en x=2.':'Sin bloqueo, dos lecturas de x=0 pueden causar una actualización perdida.')+'</p>';$viz.innerHTML='<div class="timeline">'+Array.from({length:lock?2:4},(_,i)=>'<div class="timeline-step '+(i<step?'done':'')+'">'+(lock?'Hilo '+(i?'B':'A')+' incrementa de forma atómica':instructions[i].join(': '))+'</div>').join('')+'</div>'}
 $('#mutex').onchange=()=>{step=0;draw()};$('#next').onclick=()=>{step=Math.min(step+1,$('#mutex').checked?2:4);draw()};$('#restart').onclick=()=>{step=0;draw()};draw();return;
 }
 if(t==='flow'){
 const { $out,$viz }=base(root,'Ejecuta un algoritmo paso a paso y observa cómo cambian sus variables.',slider('max','Límite de iteraciones',2,20,6)+action('next','Ejecutar instrucción')+action('reset','Reiniciar'));
 let step=0,total=0;const draw=()=>{$out.innerHTML='<strong>Iteración '+step+' · suma acumulada '+total+'</strong><p>Algoritmo: suma de los enteros de 1 a N; resultado esperado = N(N+1)/2.</p>';$viz.innerHTML='<pre class="code-block">suma = 0\npara i desde 1 hasta '+n(root,'#max')+':\n    suma = suma + i\nimprimir(suma)</pre>'};$('#next').onclick=()=>{if(step<n(root,'#max')){step++;total+=step}draw()};$('#reset').onclick=()=>{step=0;total=0;draw()};$('#max').oninput=()=>{step=0;total=0;draw()};draw();return;
 }
 if(t==='terminal'){
 // El campo se encuentra DENTRO de la consola, junto al prompt, como en una terminal.
 root.innerHTML='<section class="terminal-workspace"><div class="terminal-window" role="group" aria-label="Terminal interactiva de archivos">'+
 '<div class="terminal-window-title"><span class="terminal-dots" aria-hidden="true"><i></i><i></i><i></i></span><span>Terminal · práctica libre</span><span class="terminal-local">Local · simulada</span></div>'+
 '<div class="terminal-scroll" id="terminal-scroll"><pre id="terminal-log" class="terminal-log" aria-live="polite"></pre>'+
 '<label class="terminal-prompt"><span id="terminal-cwd">alumno@lab:~$</span><input id="command" autocomplete="off" spellcheck="false" aria-label="Comando de terminal, pulsa Intro para ejecutar" placeholder="Escribe un comando…" /></label></div></div>'+
 '<div class="terminal-toolbar"><button type="button" id="run" class="btn">Ejecutar ↵</button><button type="button" id="clear" class="btn secondary">Reiniciar archivos</button><span>Intro para ejecutar · ↑ ↓ historial · <code>help</code> para comandos</span></div>'+
 '<section class="terminal-coach"><div class="terminal-coach-title"><b>¿Con qué empiezo?</b><span id="terminal-hint-count">0/4</span></div>'+
 '<p id="terminal-hint" aria-live="polite">Puedes escribir cualquier comando admitido, incluso aunque no corresponda a la misión.</p>'+
 '<div class="terminal-coach-actions"><button type="button" id="terminal-hint-next" class="btn secondary">💡 Mostrar una pista</button><button type="button" id="terminal-hint-insert" class="btn secondary" hidden>Completar parte del comando</button></div></section></section>';
 const $=selector=>root.querySelector(selector);
 const commandInput=$('#command');
 const history=[];let historyIndex=0,hintIndex=0;
 const recipes={
 'soa-2':['mkdir ejercicios','touch ejercicios/notas.txt','write ejercicios/notas.txt hola','cat ejercicios/notas.txt'],
 'soa-6':['mkdir proyecto','touch proyecto/notas.txt','ls proyecto','cat proyecto/notas.txt'],
 'soa-4':['pwd','ls','cd home','pwd'],
 'soa-5':['ls','mkdir informes','touch informes/resumen.txt','tree'],
 };
 const recipe=recipes[lab.id]||['pwd','ls','mkdir pruebas','tree'];
 const hints=[
  {hint:'Empieza mirando dónde estás. En una terminal suele hacerse con un comando de tres letras.',snippet:recipe[0].split(' ')[0]},
  {hint:'Puedes pedir ayuda escribiendo «help». Un comando se escribe seguido de argumentos separados por espacios.',snippet:recipe[0]},
  {hint:'Después de crear una carpeta con mkdir, «touch» crea un archivo vacío. Usa rutas relativas para practicar.',snippet:recipe[1]||recipe[0]},
  {hint:'Esta es una posible secuencia para explorar archivos. Puedes escribir otros comandos y crear rutas diferentes.',snippet:recipe.join('\n')}
 ];

 const initialTree={type:'dir',children:{home:{type:'dir',children:{alumno:{type:'dir',children:{'leeme.txt':{type:'file',data:'Bienvenido al laboratorio'}}}}}}};let tree=structuredClone(initialTree),cwd=['home','alumno'],log=[];
 const normPath=p=>{const path=p.startsWith('/')?[]:[...cwd];for(const seg of p.split('/')){if(!seg||seg==='.')continue;if(seg==='..')path.pop();else path.push(seg)}return path};
 const lookup=path=>path.reduce((x,name)=>x?.type==='dir'?x.children[name]:null,tree);
 const getParent=p=>{const path=normPath(p);return {path,parent:lookup(path.slice(0,-1)),name:path.at(-1)}};
 const command=input=>{const parts=input.trim().match(/"[^"]*"|'[^']*'|\S+/g)?.map(x=>x.replace(/^["']|["']$/g,''))||[];if(!parts.length)return'';const [op,...args]=parts;let a=args[0]||'.',node=lookup(normPath(a));
 if(op==='help')return 'Comandos: pwd, ls, cd, mkdir, touch, cat, write, cp, mv, rm, tree, help';
 if(op==='pwd')return '/'+cwd.join('/');
 if(op==='ls')return node?.type==='dir'?Object.keys(node.children).join('  '):node?.type==='file'?a:'Ruta no encontrada';
 if(op==='cd'){if(node?.type!=='dir')return 'No existe ese directorio';cwd=normPath(a);return '/'+cwd.join('/')}
 if(op==='mkdir'||op==='touch'){const {parent,name}=getParent(a);if(!parent||parent.type!=='dir'||!name)return'Ruta inválida';if(parent.children[name])return'Ya existe';parent.children[name]=op==='mkdir'?{type:'dir',children:{}}:{type:'file',data:''};return'Creado: '+name}
 if(op==='cat')return node?.type==='file'?node.data:'No es un archivo';
 if(op==='write'){const p=args[0],data=args.slice(1).join(' ');if(!p||!data)return'Uso: write archivo.txt texto';const file=lookup(normPath(p));if(file?.type!=='file')return'Archivo inexistente';file.data=data.slice(0,500);return'Escritos '+file.data.length+' caracteres'}
 if(op==='cp'||op==='mv'){const dest=args[1];if(!dest)return'Uso: '+op+' origen destino';if(node?.type!=='file')return'Solo se permiten archivos';const {parent,name}=getParent(dest);if(parent?.type!=='dir'||!name)return'Destino inválido';parent.children[name]={type:'file',data:node.data};if(op==='mv'){const old=getParent(a);delete old.parent.children[old.name]}return'Operación completada'}
 if(op==='rm'){const {parent,name}=getParent(a);if(node?.type!=='file'||!parent)return'Solo se pueden eliminar archivos';delete parent.children[name];return'Archivo eliminado'}
 if(op==='tree'){const list=(o,d=0)=>Object.entries(o.children||{}).map(([k,v])=>'  '.repeat(d)+k+(v.type==='dir'?'/\n'+list(v,d+1):'')).join('\n');return list(tree)}
 return'Comando no reconocido';
 };
 const draw=()=>{
  $('#terminal-cwd').textContent='alumno@lab:/'+cwd.join('/')+'
 }
}
export const COMPUTING_TYPES=new Set(['graph','sorting','structures','scheduler','memory','network','packet','architecture','threads','flow','terminal']);
export {shortest};
;
  $('#terminal-log').textContent=log.map(x=>x.command+'\n'+x.result).join('\n\n');
  const scroller=$('#terminal-scroll');scroller.scrollTop=scroller.scrollHeight;
 };
 const run=()=>{
  const input=commandInput.value.trim();
  if(!input){commandInput.focus();return}
  const result=command(input);
  log.push({command:'alumno@lab:/'+cwd.join('/')+'$ '+input,result:result||'(sin salida)'});
  log=log.slice(-70);
  history.push(input);historyIndex=history.length;commandInput.value='';draw();commandInput.focus();
 };
 $('#run').onclick=run;
 commandInput.onkeydown=e=>{
  if(e.key==='Enter'){e.preventDefault();run()}
  else if(e.key==='ArrowUp'){e.preventDefault();historyIndex=Math.max(0,historyIndex-1);commandInput.value=history[historyIndex]||''}
  else if(e.key==='ArrowDown'){e.preventDefault();historyIndex=Math.min(history.length,historyIndex+1);commandInput.value=history[historyIndex]||''}
 };
 $('#clear').onclick=()=>{tree=structuredClone(initialTree);log=[];cwd=['home','alumno'];historyIndex=history.length;commandInput.value='';draw();commandInput.focus()};
 $('#terminal-hint-next').onclick=()=>{
  if(hintIndex>=hints.length)return;
  const h=hints[hintIndex++];
  $('#terminal-hint-count').textContent=hintIndex+'/'+hints.length;
  $('#terminal-hint').textContent=h.hint;
  const snip=$('#terminal-hint-insert');snip.hidden=!h.snippet;snip.dataset.fragment=h.snippet;
  snip.textContent=hintIndex===hints.length?'Ver secuencia completa en la entrada':'Insertar fragmento en la entrada';
  $('#terminal-hint-next').disabled=hintIndex>=hints.length;
 };
 $('#terminal-hint-insert').onclick=()=>{
  const fragment=$('#terminal-hint-insert').dataset.fragment||'';
  // Una lista multilinea es una referencia. No la ejecutamos automáticamente.
  const first=fragment.split('\n')[0];
  if(commandInput.value.trim())commandInput.value+=' '+first;
  else commandInput.value=first;
  commandInput.focus();
 };
 draw();return;
 }
}
export const COMPUTING_TYPES=new Set(['graph','sorting','structures','scheduler','memory','network','packet','architecture','threads','flow','terminal']);
export {shortest};
