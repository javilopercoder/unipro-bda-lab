import { PGlite } from '@electric-sql/pglite';
import {FIRST_NAMES,LAST_NAMES} from './demo-data.js';
const sqlArray=items=>'ARRAY['+items.map(s=>"'"+s.replaceAll("'","''")+"'").join(',')+']';
const schema = [
  "CREATE TABLE clientes(id integer primary key,nombre text not null,ciudad text not null,correo text,segmento text,fecha_alta date,activo boolean)",
  "INSERT INTO clientes(id,nombre,ciudad) VALUES (1,'Ana','Madrid'),(2,'Luis','Sevilla'),(3,'Marta','Madrid'),(4,'Eva','Valencia'),(5,'Pablo','Madrid')",
  "CREATE TABLE pedidos(id integer primary key,cliente_id integer references clientes(id),importe numeric(10,2),fecha date)",
  "INSERT INTO pedidos VALUES(1,1,120,'2026-01-04'),(2,2,80,'2026-01-05'),(3,1,50,'2026-01-06'),(4,3,200,'2026-02-02'),(5,2,40,'2026-02-03'),(6,5,180,'2026-02-10'),(7,5,60,'2026-02-11')",
  "CREATE TABLE dim_producto(id integer primary key,nombre text,categoria text)",
  "INSERT INTO dim_producto VALUES(1,'Teclado','Informática'),(2,'Ratón','Informática'),(3,'Libro','Lectura'),(4,'Cuaderno','Papelería')",
  "CREATE TABLE fact_ventas(id integer primary key,producto_id integer references dim_producto(id),monto numeric(10,2))",
  "INSERT INTO fact_ventas VALUES (1,1,45),(2,2,25),(3,3,60),(4,1,80),(5,4,20),(6,3,30)"  ,
  // Datos sintéticos deterministas: 1.205 clientes, 6.007 pedidos, 64 productos, 8.006 ventas.
  "UPDATE clientes SET correo='persona'||lpad(id::text,4,'0')||'@ejemplo.test', segmento=CASE WHEN id%3=0 THEN 'Empresa' WHEN id%3=1 THEN 'Particular' ELSE 'Profesional' END, fecha_alta=date '2024-01-01'+(id%900), activo=(id%11<>0)",
  `INSERT INTO clientes(id,nombre,ciudad,correo,segmento,fecha_alta,activo)
   SELECT s, (${sqlArray(FIRST_NAMES)})[1+((s*17+3)%${FIRST_NAMES.length})] || ' ' ||
     (${sqlArray(LAST_NAMES)})[1+(((s/40)*7+s*13+7)%${LAST_NAMES.length})] ||
     CASE WHEN s%5=0 THEN ' ' || (${sqlArray(LAST_NAMES)})[1+((s*19+11)%${LAST_NAMES.length})] ELSE '' END,
     (ARRAY['Madrid','Sevilla','Valencia','Bilbao','Zaragoza','Málaga','Granada','Vigo'])[1+(s%8)],
     'persona'||lpad(s::text,4,'0')||'@ejemplo.test',
     CASE WHEN s%3=0 THEN 'Empresa' WHEN s%3=1 THEN 'Particular' ELSE 'Profesional' END,
     date '2024-01-01'+(s%900), s%11<>0
   FROM generate_series(6,1205) s`,
  "INSERT INTO pedidos SELECT s, 1+(s * 17 % 1205), (10+(s * 37 % 900))::numeric(10,2), date '2026-01-01' + (s % 300) FROM generate_series(8,6007) s",
  "INSERT INTO dim_producto SELECT s, 'Producto ' || s, (ARRAY['Informática','Lectura','Papelería','Hogar'])[1+(s % 4)] FROM generate_series(5,64) s",
  "INSERT INTO fact_ventas SELECT s, 1+(s * 11 % 64), (15+(s * 29 % 800))::numeric(10,2) FROM generate_series(7,8006) s"

];
export const SQL_DATA_COUNTS=Object.freeze({clientes:1205,pedidos:6007,productos:64,ventas:8006});
let dbPromise;
export async function connect(){
  if(!dbPromise)dbPromise=(async()=>{const db=new PGlite();for(const line of schema)await db.exec(line);return db})().catch(e=>{dbPromise=null;throw e});
  return dbPromise;
}
export async function resetSQL(){const old=dbPromise;dbPromise=null;if(old){try{await (await old).close()}catch{}}return connect()}
export function safeQuery(sql){
  const value=String(sql||'').trim();
  if(!value||value.length>6000)throw Error('La consulta debe contener entre 1 y 6000 caracteres.');
  if(!/^\s*(SELECT|WITH|VALUES|TABLE|EXPLAIN)\b/i.test(value))throw Error('En este entorno utiliza SELECT, WITH o EXPLAIN. Los cambios de datos van en el simulador de transacciones.');
  if(/\b(COPY|CREATE|DROP|ALTER|DELETE|UPDATE|INSERT|TRUNCATE|CALL|DO|pg_sleep|pg_read_file|pg_ls_dir|dblink)\b/i.test(value))throw Error('Operación no permitida en el editor de práctica.');
  if(value.replace(/;\s*$/,'').includes(';'))throw Error('Ejecuta una única sentencia.');
  return value;
}
export async function runSQL(sql){
  const db=await connect(),start=performance.now(),result=await db.query(safeQuery(sql),[],{rowMode:'array'}),fields=(result.fields||[]).map(x=>x.name);
  // PGlite en modo array conserva las columnas con nombre repetido y ejecuta SQL una sola vez.
  const values=result.rows||[],rows=values.map(values=>Object.fromEntries(fields.map((name,i)=>[name,values[i]])));
  return{fields,rows,values,duration:Math.round(performance.now()-start)};
}
function normalize(result){return result.rows.map(row=>JSON.stringify(Object.values(row).map(x=>typeof x==='bigint'?String(x):x))).sort()}
export async function evaluateSQL(sql,expected){
  const db=await connect();const [actual,target]=await Promise.all([db.query(safeQuery(sql)),db.query(safeQuery(expected))]);
  const a=normalize(actual),b=normalize(target);return{pass:a.length===b.length&&a.every((x,i)=>x===b[i]),expectedCount:b.length};
}

export const SQL_TABLES=Object.freeze(['clientes','pedidos','dim_producto','fact_ventas']);
export async function getSQLCatalog(){
 const db=await connect();
 const cols=await db.query(`SELECT table_name AS tabla,column_name AS columna,data_type AS tipo,is_nullable AS admite_nulos
   FROM information_schema.columns WHERE table_schema='public'
   AND table_name IN ('clientes','pedidos','dim_producto','fact_ventas')
   ORDER BY table_name,ordinal_position`);
 const relationships=[
   {origen:'pedidos.cliente_id',destino:'clientes.id',tipo:'FK'},
   {origen:'fact_ventas.producto_id',destino:'dim_producto.id',tipo:'FK'}
 ];
 const tables=[];
 for(const name of SQL_TABLES){
   const qty=await db.query('SELECT COUNT(*)::integer AS total FROM '+name);
   let bytes=null,heapBytes=null,indexBytes=null;
   try{
     const sizes=await db.query('SELECT pg_total_relation_size($1::regclass)::bigint AS total, pg_relation_size($1::regclass)::bigint AS heap, pg_indexes_size($1::regclass)::bigint AS indices',[name]);
     const size=sizes.rows[0];
     bytes=Number(size.total);heapBytes=Number(size.heap);indexBytes=Number(size.indices);
   }catch{/* Algunos builds ligeros pueden no disponer de las funciones de tamaños. */}
   tables.push({name,count:qty.rows[0].total,bytes,heapBytes,indexBytes,columns:cols.rows.filter(c=>c.tabla===name)});
 }
 return{engine:'PostgreSQL · PGlite',tables,relationships,measuredAt:new Date().toISOString()};
}
