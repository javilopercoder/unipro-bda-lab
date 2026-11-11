import {fictionalName,fictionalEmail} from './demo-data.js';
const base=[
 {_id:1,nombre:'Ana',ciudad:'Madrid',edad:27,gasto:170},
 {_id:2,nombre:'Luis',ciudad:'Sevilla',edad:31,gasto:120},
 {_id:3,nombre:'Marta',ciudad:'Madrid',edad:40,gasto:200},
 {_id:4,nombre:'Eva',ciudad:'Valencia',edad:24,gasto:0},
 {_id:5,nombre:'Pablo',ciudad:'Madrid',edad:35,gasto:240}
];
// Ampliación reproducible. El simulador sigue sin ejecutar un servidor MongoDB.
const cities=['Madrid','Sevilla','Valencia','Bilbao','Zaragoza','Málaga','Granada','Vigo'];
export const MONGO_DATA_COUNT=2505;
const data=base.concat(Array.from({length:MONGO_DATA_COUNT-base.length},(_,k)=>{
 const id=k+6;
 return {_id:id,nombre:fictionalName(id),ciudad:cities[(id*7)%cities.length],edad:18+(id%52),gasto:(id*37)%1800,correo:fictionalEmail(id),segmento:['Particular','Profesional','Empresa'][id%3],activo:id%11!==0};
}));
const columns=new Set(['_id','nombre','ciudad','edad','gasto','correo','segmento','activo']);
function object(x){if(!x||typeof x!=='object'||Array.isArray(x))throw Error('Se esperaba un objeto JSON.');return x}
function match(x,f){return Object.entries(object(f)).every(([k,v])=>{
 if(!columns.has(k))throw Error('Campo desconocido: '+k);
 if(v&&typeof v==='object'&&!Array.isArray(v)){
  const ops=Object.keys(v);if(ops.length!==1||!['$gt','$gte','$lt','$lte','$eq','$ne'].includes(ops[0]))throw Error('Operador no permitido.');
  const op=ops[0],n=v[op],a=x[k];return ({$gt:a>n,$gte:a>=n,$lt:a<n,$lte:a<=n,$eq:a===n,$ne:a!==n})[op]
 }
 return x[k]===v;
})}
export function mongoData(){return data.map(x=>({...x}))}
export function runMongo(input){
 const code=String(input||'').trim();if(code.length>3000)throw Error('Consulta demasiado larga.');
 const m=/^db\.clientes\.(find|aggregate)\(([\s\S]*)\)\s*;?$/.exec(code);
 if(!m)throw Error('Este simulador dispone de db.clientes.find(filtro, proyección) y aggregate([...]).');
 if(m[1]==='find'){
  let args;try{args=JSON.parse('['+m[2]+']')}catch{throw Error('Usa argumentos JSON (comillas dobles).')}
  if(!args.length||args.length>2)throw Error('find admite filtro y proyección opcional.');
  let result=data.filter(x=>match(x,args[0])).map(x=>({...x}));
  if(args[1]){
   const p=object(args[1]);for(const k of Object.keys(p))if(!columns.has(k)||![0,1].includes(p[k]))throw Error('Proyección no admitida.');
   const includes=Object.keys(p).filter(k=>k!=='_id'&&p[k]===1);result=result.map(x=>{
    if(includes.length){const o=Object.fromEntries(includes.map(k=>[k,x[k]]));if(p._id!==0)o._id=x._id;return o}
    for(const [k,v]of Object.entries(p))if(v===0)delete x[k];return x;
   });
  }return result;
 }
 let pipeline;try{pipeline=JSON.parse(m[2])}catch{throw Error('Pipeline JSON inválido.')}
 if(!Array.isArray(pipeline)||pipeline.length>5)throw Error('Pipeline de máximo cinco etapas.');
 let results=mongoData();
 for(const stage of pipeline){
  const s=object(stage),ops=Object.keys(s);if(ops.length!==1)throw Error('Una operación por etapa.');
  const op=ops[0],v=s[op];
  if(op==='$match'){results=results.filter(x=>match(x,v));continue}
  if(op==='$group'){
   const g=object(v),field=String(g._id||'');
   if(!/^\$(ciudad|edad|nombre)$/.test(field)||!g.total||g.total.$sum!==1)throw Error('Agrupa por ciudad, edad o nombre con total: {$sum:1}.');
   const counts=new Map;for(const x of results){const k=x[field.slice(1)];counts.set(k,(counts.get(k)||0)+1)}
   results=[...counts].map(([_id,total])=>({_id,total}));continue
  }
  if(op==='$sort'){const srt=object(v),keys=Object.keys(srt),field=keys[0];if(keys.length!==1||!['_id','ciudad','nombre','total'].includes(field)||![1,-1].includes(srt[field]))throw Error('Ordenación no soportada.');results.sort((a,b)=>String(a[field]).localeCompare(String(b[field]),'es',{numeric:true})*srt[field]);continue}
  if(op==='$limit'){if(!Number.isInteger(v)||v<0||v>100)throw Error('Límite fuera de rango');results=results.slice(0,v);continue}
  throw Error('Etapa no soportada: '+op);
 }
 return results;
}
const sortedIds=rows=>rows.map(x=>x._id).sort((a,b)=>a-b);
const same=(a,b)=>a.length===b.length&&a.every((x,i)=>x===b[i]);
export function evaluateMongo(command,id){
 const results=runMongo(command),madrid=data.filter(x=>x.ciudad==='Madrid');
 if(id==='m1')return same(sortedIds(results),sortedIds(madrid));
 if(id==='m2'){
  const got=results.map(x=>x.nombre).sort(),expected=madrid.map(x=>x.nombre).sort();
  return results.every(x=>Object.keys(x).length===1&&typeof x.nombre==='string')&&same(got,expected);
 }
 if(id==='m3'){
  const counts=new Map;
  for(const row of data)counts.set(row.ciudad,(counts.get(row.ciudad)||0)+1);
  return results.length===counts.size&&results.every(row=>Object.keys(row).length===2&&row.total===counts.get(row._id));
 }
 return null;
}

export function getMongoCatalog(){
 const fields=[...new Set(data.flatMap(Object.keys))];
 const totalBytes=data.reduce((n,row)=>n+new TextEncoder().encode(JSON.stringify(row)).byteLength,0);
 return{
  engine:'Documentos · simulador local (no MongoDB real)',
  collections:[{name:'clientes',count:data.length,bytes:totalBytes,
    fields:fields.map(name=>({name,types:[...new Set(data.map(x=>typeof x[name]).filter(Boolean))],present:data.filter(row=>Object.hasOwn(row,name)).length}))}],
  measuredAt:new Date().toISOString(),
  sizeDescription:'Bytes de JSON serializado en memoria, no almacenamiento de MongoDB ni índices'
 };
}
