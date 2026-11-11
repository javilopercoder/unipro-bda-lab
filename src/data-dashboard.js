import {getSQLCatalog,runSQL} from './postgres.js';
import {getMongoCatalog,mongoData} from './mongo.js';
import {PURCHASES} from './analytics.js';

export const LAB_NOTE='Tamaños del motor SQL: bytes que informa PostgreSQL local. Mongo/OLAP: bytes aproximados de JSON en memoria. No existe ningún servidor remoto.';
export function formatBytes(value){
 if(value===null||value===undefined||!Number.isFinite(Number(value)))return 'No disponible';
 const n=Number(value);if(n<1024)return n+' B';
 return (n/Math.pow(1024,Math.floor(Math.log(n)/Math.log(1024)))).toFixed(1)+' '+['B','KiB','MiB','GiB'][Math.floor(Math.log(n)/Math.log(1024))];
}
export function createQueryHistory(limit=25){
 const items=[];
 return {
  add({engine,sql,rows,duration,error}){
   const entry={engine,sql:String(sql||'').slice(0,1200),rows:rows??null,duration:duration??null,error:error?String(error):null,date:new Date().toISOString()};
   items.unshift(entry);if(items.length>limit)items.length=limit;return entry;
  },
  list:()=>items.map(x=>({...x})),
  last:()=>items[0]||null,
  clear:()=>{items.length=0}
 };
}
const E=(name,cls,text)=>{
 const el=document.createElement(name);if(cls)el.className=cls;
 if(text!==undefined)el.textContent=String(text);return el;
};
const byteLength=data=>new TextEncoder().encode(JSON.stringify(data)).byteLength;
function metric(label,value){const e=E('div','data-metric');e.append(E('span','',label),E('strong','',value));return e}
function resultTable(rows,fields=null,limit=15){
 const box=E('div','data-preview-scroll');const cols=fields||Object.keys(rows[0]||{});
 const tab=E('table','data-preview-table'),thead=E('thead'),top=E('tr');
 cols.forEach(x=>top.append(E('th','',x)));thead.append(top);tab.append(thead);
 const tbody=E('tbody');
 rows.slice(0,limit).forEach(row=>{
  const tr=E('tr');
  cols.forEach((field,i)=>{const v=Array.isArray(row)?row[i]:row[field];tr.append(E('td','',v===null||v===undefined?'NULL':typeof v==='object'?JSON.stringify(v):String(v)))});
  tbody.append(tr);
 });
 tab.append(tbody);box.append(tab);
 if(!rows.length)box.append(E('p','data-empty','Sin registros'));
 if(rows.length>limit)box.append(E('p','data-hint','Vista previa: '+limit+' de '+rows.length+' filas'));
 return box;
}
function section(title,description){
 const el=E('section','panel data-catalog-panel');
 el.append(E('h2','',title),E('p','data-hint',description));
 return el;
}
function addHistory(host,history,onRepeat){
 const block=section('Historial de consultas','Últimas consultas de esta sesión en este navegador. No se envían ni se guardan en un servidor.');
 const items=history.list();
 if(!items.length){block.append(E('p','data-empty','Todavía no has ejecutado consultas.'));host.append(block);return}
 const wrap=E('div','data-history');
 for(const item of items.slice(0,10)){
  const line=E('div','data-history-entry');
  const info=E('div');
  info.append(E('small','',new Date(item.date).toLocaleTimeString('es-ES')+' · '+item.engine+' · '+(item.error?'Error':item.rows+' filas')+(item.duration===null?'':' · '+item.duration+' ms')),E('code','',item.sql));
  if(item.error)info.append(E('small','data-error',item.error));
  line.append(info);
  if(onRepeat){const b=E('button','btn secondary','Reutilizar');b.onclick=()=>onRepeat(item);line.append(b)}
  wrap.append(line);
 }
 block.append(wrap);host.append(block);
}
export async function mountDataExplorer(host,{mode='sql',history,openQuery,redis,xml}={}){
 host.replaceChildren();
 const loading=E('p','data-hint','Preparando el catálogo local…');host.append(loading);
 try{
  const isSQL=mode==='sql',isMongo=mode==='mongo';
  if(mode==='redis'||mode==='xml'){
   host.replaceChildren();
   if(mode==='redis'){
    const info=redis?.snapshot()||[];
    const intro=section('Redis · claves en memoria','Este módulo es un simulador local. Los tamaños son bytes UTF-8 de los valores, no memoria de Redis real.');
    const stats=E('div','data-metrics');stats.append(metric('Claves',info.length),metric('Bytes de valores',formatBytes(info.reduce((sum,x)=>sum+x.bytes,0))),metric('TTL activas',info.filter(x=>x.ttl>=0).length));intro.append(stats);
    const btn=E('button','btn secondary','Cargar 10 claves de ejemplo');btn.onclick=()=>{redis.seedDemo();mountDataExplorer(host,{mode,history,openQuery,redis,xml})};intro.append(btn);host.append(intro);
    const keys=section('Inventario de claves','Utiliza la consola Redis para editar valores, incrementar contadores o aplicar EXPIRE.');keys.append(resultTable(info,['clave','tipo','valor','bytes','ttl'],80));host.append(keys);
   }else{
    const source=String(xml||'');const bytes=new TextEncoder().encode(source).byteLength;
    let documentCount=0,attributes=0,tags=[];
    if(typeof DOMParser!=='undefined'){
     const parsed=new DOMParser().parseFromString(source,'application/xml');
     if(!parsed.querySelector('parsererror')){const nodes=[...parsed.getElementsByTagName('*')];documentCount=nodes.length;attributes=nodes.reduce((n,node)=>n+node.attributes.length,0);tags=[...new Set(nodes.map(x=>x.tagName))]}
    }
    const intro=section('XML · estructura del documento','Metadatos del documento XML ficticio editable: estos valores se calculan en tu navegador.');const stats=E('div','data-metrics');stats.append(metric('Elementos',documentCount),metric('Atributos',attributes),metric('Tamaño del XML',formatBytes(bytes)));intro.append(stats);host.append(intro);
    const tagsBox=section('Etiquetas existentes','Usa estas etiquetas para construir tus expresiones XPath.');tagsBox.append(resultTable(tags.map(nombre=>({nombre})),['nombre'],60));host.append(tagsBox);
   }
   if(openQuery){const b=E('button','btn secondary',mode==='redis'?'Ir a la consola Redis':'Ir al editor XPath');b.onclick=()=>openQuery('');host.append(b)}
   if(history)addHistory(host,history,null);return;
  }
  const catalog=isSQL?await getSQLCatalog():isMongo?getMongoCatalog():null;
  host.replaceChildren();
  const intro=section('Explorador de datos',isSQL?'Metadatos obtenidos del catálogo PostgreSQL real que se ejecuta en el navegador.':isMongo?'Colecciones y esquema inferido del simulador documental; el tamaño es una estimación del JSON.':'Inventario de los datos ficticios usados por las prácticas.');
  intro.classList.add('data-catalog-intro');
  const stats=E('div','data-metrics');
  const entities=isSQL?catalog.tables:isMongo?catalog.collections:[
    {name:'operaciones_olap',count:PURCHASES.length,bytes:byteLength(PURCHASES),columns:Object.keys(PURCHASES[0]||{}).map(name=>({columna:name,tipo:typeof PURCHASES[0][name]}))}
  ];
  stats.append(metric('Conjuntos de datos',entities.length),metric('Registros',entities.reduce((a,x)=>a+x.count,0).toLocaleString('es-ES')),metric('Última consulta',history?.last()?new Date(history.last().date).toLocaleTimeString('es-ES'):'Sin consultas'));
  intro.append(stats,E('p','data-hint',LAB_NOTE));host.append(intro);
  for(const entry of entities){
   const block=section(entry.name,entry.count.toLocaleString('es-ES')+' registros · '+formatBytes(entry.bytes)+(entry.bytes===null?' (no medible en este motor)':''));
   const actions=E('div','data-table-actions');
   if(openQuery){const btn=E('button','btn secondary','Abrir consulta');btn.onclick=()=>openQuery(isSQL?'SELECT * FROM '+entry.name+' LIMIT 25;':isMongo?'db.clientes.find({})':'');actions.append(btn)}
   const details=E('details','data-table-details');
   const summary=E('summary','', 'Ver columnas y tipos');
   details.append(summary);
   const columns=isSQL?entry.columns.map(x=>({nombre:x.columna,tipo:x.tipo,extra:x.admite_nulos==='NO'?'NOT NULL':'NULL'})):
    isMongo?entry.fields.map(x=>({nombre:x.name,tipo:x.types.join(' / '),extra:x.present+'/'+entry.count+' documentos'})):
    entry.columns.map(x=>({nombre:x.columna,tipo:x.tipo,extra:''}));
   details.append(resultTable(columns,['nombre','tipo','extra'],60));
   block.append(actions,details);
   if(isSQL){
    block.append(E('p','data-hint','Datos de almacenamiento local · Tabla: '+formatBytes(entry.heapBytes)+' · Índices: '+formatBytes(entry.indexBytes)));
   }
   const preview=E('details','data-table-details');preview.append(E('summary','','Vista previa de datos'));
   const area=E('div','data-preview-content');preview.append(area);
   preview.addEventListener('toggle',async()=>{
    if(!preview.open||area.dataset.loaded)return;
    area.textContent='Consultando datos…';
    try{
     const rows=isSQL?(await runSQL('SELECT * FROM '+entry.name+' LIMIT 15')).rows:isMongo?mongoData().slice(0,15):PURCHASES.slice(0,15);
     area.replaceChildren(resultTable(rows,null,15));area.dataset.loaded='true';
    }catch(error){area.textContent='No se pudo obtener la vista previa: '+error.message}
   });
   block.append(preview);host.append(block);
  }
  if(isSQL){
   const rel=section('Relaciones entre tablas','Claves foráneas del conjunto de prácticas.');
   rel.append(resultTable(catalog.relationships.map(x=>({origen:x.origen,relacion:x.tipo,destino:x.destino})),['origen','relacion','destino'],15));host.append(rel);
  }
  if(history)addHistory(host,history,openQuery?item=>openQuery(item.sql):null);
 }catch(error){host.replaceChildren(E('p','data-error','No se pudo leer el catálogo: '+(error.message||String(error))))}
}
