import './styles.css';
import {SQL_TASKS,MONGO_TASKS,XML_TASKS,SAMPLE_XML} from './challenges.js';
import {runSQL,evaluateSQL,resetSQL} from './postgres.js';
import {runMongo,evaluateMongo,mongoData} from './mongo.js';
import {executeXPath,evaluateXPath} from './xml.js';
import {RedisSim} from './redis.js';
import {BankSim} from './transactions.js';
import {rollup,segments,distributed} from './analytics.js';

const MODULES=[
 {id:'sql',icon:'⌘',name:'SQL / PostgreSQL',subtitle:'Consultas reales · Tema 9',label:'Motor real'},
 {id:'mongo',icon:'{}',name:'Documentos / MongoDB',subtitle:'Consultas simuladas · Tema 10',label:'Simulador'},
 {id:'xml',icon:'</>',name:'XML y XPath',subtitle:'Procesador real · Temas 2 y 3',label:'Procesador real'},
 {id:'redis',icon:'▦',name:'Redis / clave-valor',subtitle:'Consola simulada · Tema 10',label:'Simulador'},
 {id:'transactions',icon:'↺',name:'Transacciones',subtitle:'SAVEPOINT y COMMIT · Tema 7',label:'Simulador'},
 {id:'plans',icon:'◷',name:'Planes de ejecución',subtitle:'EXPLAIN local · Temas 6 y 9',label:'Motor real'},
 {id:'analytics',icon:'▤',name:'OLAP y minería',subtitle:'Agregaciones y segmentos · Temas 11 y 12',label:'Práctica local'},
 {id:'distributed',icon:'◈',name:'Bases distribuidas',subtitle:'Pushdown y tráfico · Temas 4 y 5',label:'Simulador'}
];
const app=document.querySelector('#app');
app.innerHTML='<header class="topbar"><div class="topbar-inner"><div class="brand"><span class="logo">U</span><span>UniPRO <b>Lab</b> <span class="subtle">/ Bases de Datos Avanzadas</span></span></div><div class="top-right"><span class="privacy">🔒 Datos ficticios · ejecución local</span><a href="https://javilopercoder.github.io/unipro-quiz/" target="_blank" rel="noopener noreferrer">UniPRO Quiz</a></div></div></header><div class="layout"><aside class="sidebar"><h2>Laboratorios</h2><nav id="nav" aria-label="Tecnologías"></nav><div class="sidebar-note">Los ejercicios SQL se ejecutan en tu navegador. Los otros módulos indican cuando son simulaciones. No se usa ninguna base de datos real de la universidad.</div></aside><main id="main" aria-live="polite"></main></div>';
const $=selector=>document.querySelector(selector);
const create=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=String(text);return el};
const qs=(element,selector)=>element.querySelector(selector);
const state={module:'sql',task:{sql:0,mongo:0,xml:0},redis:new RedisSim,bank:new BankSim};
const fmt=value=>value==null?'NULL':value instanceof Date?value.toISOString().slice(0,10):typeof value==='object'?JSON.stringify(value):String(value);
function status(message,type=''){
 const el=$('#state');if(el){el.className='status '+type;el.textContent=message}
}
function table(rows){const box=create('div','result-scroll');if(!rows?.length){box.append(create('p','muted','Sin filas'));return box}
 const keys=Object.keys(rows[0]),t=create('table');const head=create('thead'),tr=create('tr');
 for(const k of keys)tr.append(create('th','',k));head.append(tr);t.append(head);
 const body=create('tbody');for(const row of rows.slice(0,100)){const tr=create('tr');for(const k of keys)tr.append(create('td','',fmt(row[k])));body.append(tr)}t.append(body);box.append(t);if(rows.length>100)box.append(create('p','subtle','Se muestran 100 de '+rows.length+' filas.'));return box;
}
function output(node,rows){node.replaceChildren(table(rows))}
function heading(name,description,tag){return '<div class="heading"><div><span class="eyebrow">LABORATORIO INTERACTIVO</span><h1>'+name+'</h1><p>'+description+'</p></div><span class="tag">'+tag+'</span></div>'}
function renderNav(){
 const nav=$('#nav');nav.replaceChildren();
 for(const mod of MODULES){const b=create('button','nav-item'+(mod.id===state.module?' active':''));b.type='button';b.append(create('span','nav-icon',mod.icon),create('span','',mod.name));b.onclick=()=>{state.module=mod.id;render()};nav.append(b)}
}
function editUI({title,description,task=true,placeholder='Escribe aquí...',buttons=[]}={}){
 $('#main').innerHTML=heading(title,description,MODULES.find(m=>m.id===state.module).label)+'<div class="main-columns"><div><section class="panel"><h2 id="exercise-title">Práctica</h2><p id="goal" class="muted"></p><div id="task-buttons" class="task-list"></div></section><section class="panel"><h2>Editor</h2><textarea id="code" class="editor" spellcheck="false" aria-label="Editor de práctica" placeholder="'+placeholder+'"></textarea><div class="toolbar" id="buttons"></div><p id="state" class="status" role="status"></p></section><section class="panel"><h2>Resultados</h2><div id="results" class="result-scroll"><p class="muted">Ejecuta la consulta para ver su resultado.</p></div></section></div><aside><section class="panel"><h2>Datos y pistas</h2><div id="help" class="muted small"></div></section></aside></div>';
}
function createButton(text,fn,cls='btn'){const b=create('button',cls,text);b.type='button';b.onclick=fn;return b}
function pickTasks(tasks,selected,onSelect){const box=$('#task-buttons');box.replaceChildren();for(const [index,task]of tasks.entries()){const btn=createButton(task.label,()=>onSelect(index),'task'+(index===selected?' active':''));box.append(btn)}}
function renderSQL(plan=false){
 state.module=plan?'plans':'sql';
 editUI({title:plan?'Planes de ejecución':'SQL y PostgreSQL',description:plan?'Observa un plan de PostgreSQL sobre datos ficticios. EXPLAIN es real, aunque este conjunto de datos es pequeño.':'Escribe consultas y comprueba el resultado. Aceptamos soluciones diferentes si devuelven las filas correctas.'});
 if(plan){
  $('#exercise-title').textContent='Tarea: leer el plan';
  $('#goal').textContent='Ejecuta EXPLAIN para los pedidos de más de 100 €. Observa los operadores y el coste estimado.';
  $('#task-buttons').replaceChildren();
  $('#code').value='EXPLAIN SELECT * FROM pedidos WHERE importe > 100;';
  $('#help').textContent='Una tabla pequeña puede requerir Seq Scan incluso con índices. EXPLAIN muestra estimaciones; no simula una carga masiva.';
 }else{
  const onSelect=index=>{state.task.sql=index;const x=SQL_TASKS[index];$('#exercise-title').textContent=x.label+' · '+x.topic;$('#goal').textContent=x.goal;$('#code').value=x.starter;$('#help').textContent=x.hint;$('#results').textContent='Ejecuta la consulta o comprueba la solución.';status('');pickTasks(SQL_TASKS,index,onSelect)};
  onSelect(state.task.sql);
 }
 const run=async(grade=false)=>{const code=$('#code').value;const b=$('#buttons');b.querySelectorAll('button').forEach(x=>x.disabled=true);status('Cargando PostgreSQL / ejecutando…');
 try{const result=await runSQL(code);output($('#results'),result.rows);status('Consulta ejecutada en '+result.duration+' ms · '+result.rows.length+' filas','good');
  if(grade&&!plan){const task=SQL_TASKS[state.task.sql];if(task.expected){const check=await evaluateSQL(code,task.expected);status(check.pass?'✓ Resultado correcto. ¡Bien!':'No coincide con el resultado esperado. Prueba otra consulta o mira la pista.',check.pass?'good':'warn')}
  else status('Plan mostrado. Comprueba los operadores y sus costes; este reto no lleva nota.','good')}
 }catch(e){status(e.message||String(e),'bad');$('#results').replaceChildren(create('p','muted','No se ejecutó la consulta.'))}finally{b.querySelectorAll('button').forEach(x=>x.disabled=false)}};
 const b=$('#buttons');b.append(createButton('▶ Ejecutar',()=>run(false)),createButton('✓ Comprobar',()=>run(true),'btn secondary'),createButton('↻ Reiniciar base',async()=>{status('Reiniciando…');try{await resetSQL();status('Base de datos reiniciada','good')}catch(e){status(e.message,'bad')}},'btn secondary'));
 if(plan)b.querySelectorAll('button')[1].disabled=true;
}
function renderMongo(){
 editUI({title:'MongoDB · Documentos',description:'Practica consultas de estilo MongoDB sobre una colección JSON ficticia. Es un intérprete parcial, no un servidor MongoDB real.'});
 const select=index=>{state.task.mongo=index;const task=MONGO_TASKS[index];$('#exercise-title').textContent=task.label;$('#goal').textContent=task.goal;$('#code').value=task.starter;$('#help').textContent=task.hint+' Colección clientes: '+JSON.stringify(mongoData()[0]);status('');$('#results').textContent='Ejecuta una consulta.';pickTasks(MONGO_TASKS,index,select)};select(state.task.mongo);
 const execute=grade=>{try{const q=$('#code').value;const result=runMongo(q);output($('#results'),result);const pass=grade?evaluateMongo(q,MONGO_TASKS[state.task.mongo].id):null;status(grade?(pass?'✓ Resultado correcto':'Revisa el filtro, la proyección o la agrupación'):'Consulta interpretada: '+result.length+' documentos',grade?(pass?'good':'warn'):'good')}catch(e){status(e.message,'bad')}};
 $('#buttons').append(createButton('▶ Ejecutar',()=>execute(false)),createButton('✓ Comprobar',()=>execute(true),'btn secondary'));
}
function renderXML(){
 editUI({title:'XML y XPath',description:'El navegador analiza XML y ejecuta XPath de verdad. Este módulo no valida DTD ni implementa XQuery.'});
 const dataBox=create('div','panel');dataBox.append(create('h2','','Documento XML de práctica'));
 const xml=create('textarea','editor');xml.value=SAMPLE_XML;xml.style.minHeight='205px';xml.setAttribute('aria-label','Documento XML');dataBox.append(xml);
 $('#main .main-columns > div').prepend(dataBox);
 const select=index=>{state.task.xml=index;const task=XML_TASKS[index];$('#exercise-title').textContent=task.label;$('#goal').textContent=task.goal;$('#code').value=task.xpath;$('#help').textContent=task.hint;status('');$('#results').textContent='Ejecuta XPath.';pickTasks(XML_TASKS,index,select)};select(state.task.xml);
 const run=grade=>{try{const values=executeXPath(xml.value,$('#code').value);output($('#results'),values.map((v,i)=>({numero:i+1,valor:v})));const pass=grade?evaluateXPath(xml.value,$('#code').value,XML_TASKS[state.task.xml].id):null;status(grade?(pass?'✓ Consulta correcta':'No se ha obtenido la selección esperada'):'XPath ejecutado: '+values.length+' resultados',grade?(pass?'good':'warn'):'good')}catch(e){status(e.message,'bad')}};
 $('#buttons').append(createButton('▶ Ejecutar',()=>run(false)),createButton('✓ Comprobar',()=>run(true),'btn secondary'));
}
function renderRedis(){
 editUI({title:'Redis · Clave-valor',description:'Simula un almacén clave-valor local. Prueba SET, GET, DEL, EXISTS, INCR, EXPIRE, TTL y KEYS *.'});
 $('#exercise-title').textContent='Consola clave-valor';
 $('#goal').textContent='Crea una clave alumno con tu nombre, recupérala con GET, y después elimínala con DEL.';
 $('#task-buttons').replaceChildren();$('#code').value='SET alumno Ana';$('#help').textContent='Los datos solo viven en la sesión de esta pestaña. Es un simulador educativo de Redis.';
 const log=[];$('#results').replaceChildren(create('pre','output','Aún no se han ejecutado comandos.'));
 const exec=()=>{try{const input=$('#code').value.trim(),out=state.redis.execute(input);log.push('> '+input+'\n'+out);$('#results').replaceChildren(create('pre','output',log.slice(-30).join('\n\n')));status('Comando interpretado','good')}catch(e){status(e.message,'bad')}};
 $('#buttons').append(createButton('▶ Ejecutar',exec),createButton('↻ Limpiar',()=>{state.redis=new RedisSim;log.length=0;$('#results').replaceChildren(create('pre','output','Memoria reiniciada.'));status('')} ,'btn secondary'));
}
function renderTransactions(){
 $('#main').innerHTML=heading('Transacciones bancarias','Simula operaciones sobre dos cuentas. SAVEPOINT y ROLLBACK modifican una copia temporal; COMMIT confirma.', 'Simulador')+'<section class="panel"><h2>Dos cuentas de prueba</h2><p class="muted">Empieza una transacción, transfiere dinero, guarda un punto de control y prueba cómo se revierten los cambios.</p><div id="balances" class="grid"></div><div class="toolbar" id="buttons"></div><p class="status" id="state" role="status"></p></section><section class="panel"><h2>Registro de operaciones</h2><pre id="history" class="output"></pre></section><div class="pill warn">Simulación pedagógica. No son transacciones PostgreSQL reales ni un WAL real.</div>';
 const update=()=>{const info=state.bank.status();$('#balances').replaceChildren();for(const [name,balance]of Object.entries(info.balances)){const p=create('div','card');p.append(create('h3','',name),create('p','',balance+' €'));$('#balances').append(p)}$('#history').textContent=info.history.join('\n')||'Sin operaciones';status(info.active?'Transacción abierta (cambios provisionales)':'Sin transacción activa',info.active?'warn':'good')};
 const exec=(name,amount)=>{try{state.bank.apply(name,{amount});update()}catch(e){status(e.message,'bad')}};
 const actions=[['BEGIN'],['SAVEPOINT'],['TRANSFER',100],['ROLLBACK TO'],['COMMIT'],['ROLLBACK'],['CRASH']];
 for(const [action,amount]of actions)$('#buttons').append(createButton((action==='TRANSFER'?'TRANSFERIR 100 €':action),()=>exec(action,amount),'btn'+(action==='COMMIT'?'':' secondary')));
 $('#buttons').append(createButton('↻ Reiniciar',()=>{state.bank.reset();update()},'btn secondary'));update();
}
function renderAnalytics(){
 $('#main').innerHTML=heading('OLAP y minería de datos','Explora un conjunto de ventas ficticias y segmenta clientes. Las agregaciones se calculan; los segmentos usan umbrales didácticos.', 'Práctica local')+'<section class="panel"><h2>Ventas por dimensión</h2><label for="dimension" class="muted">Agrupar por</label> <select class="field" id="dimension"><option value="categoria">Categoría</option><option value="region">Región</option><option value="mes">Mes</option><option value="cliente">Cliente</option></select><div id="olap-table"></div></section><section class="panel"><h2>Segmentación de clientes</h2><p class="muted">Clasificación por umbrales de gasto, no algoritmo K-Means. Sirve para distinguir agrupación de clasificación.</p><div id="segment-table"></div></section>';
 const render=()=>output($('#olap-table'),rollup($('#dimension').value));$('#dimension').onchange=render;render();output($('#segment-table'),segments());
}
function renderDistributed(){
 $('#main').innerHTML=heading('Consultas distribuidas','Compara cuánto se transferiría por red si filtramos los datos en origen o después de traerlos. Es una simulación.', 'Simulador')+'<section class="panel"><h2>Selección por región</h2><div class="row"><label for="region">Región</label><select class="field" id="region"><option>Centro</option><option>Sur</option><option>Este</option></select><label class="row"><input type="checkbox" checked id="pushdown">Aplicar filtro remoto (pushdown)</label></div><div id="distributed-info" style="margin-top:20px"></div></section><div class="pill warn">No hay clúster ni comunicación real. El número representa filas transferidas en el escenario propuesto.</div>';
 const show=()=>{const r=distributed({pushdown:$('#pushdown').checked,region:$('#region').value});output($('#distributed-info'),[r])};$('#pushdown').onchange=show;$('#region').onchange=show;show();
}
function render(){
 renderNav();
 try{
 if(state.module==='sql')renderSQL();else if(state.module==='plans')renderSQL(true);else if(state.module==='mongo')renderMongo();else if(state.module==='xml')renderXML();else if(state.module==='redis')renderRedis();else if(state.module==='transactions')renderTransactions();else if(state.module==='analytics')renderAnalytics();else if(state.module==='distributed')renderDistributed();
 }catch(error){$('#main').replaceChildren(create('div','panel','Error de interfaz: '+(error.message||String(error))))}
}
render();
