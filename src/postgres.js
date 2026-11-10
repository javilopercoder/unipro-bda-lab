import { PGlite } from '@electric-sql/pglite';
const schema = [
  "CREATE TABLE clientes(id integer primary key,nombre text not null,ciudad text not null)",
  "INSERT INTO clientes VALUES (1,'Ana','Madrid'),(2,'Luis','Sevilla'),(3,'Marta','Madrid'),(4,'Eva','Valencia'),(5,'Pablo','Madrid')",
  "CREATE TABLE pedidos(id integer primary key,cliente_id integer references clientes(id),importe numeric(10,2),fecha date)",
  "INSERT INTO pedidos VALUES(1,1,120,'2026-01-04'),(2,2,80,'2026-01-05'),(3,1,50,'2026-01-06'),(4,3,200,'2026-02-02'),(5,2,40,'2026-02-03'),(6,5,180,'2026-02-10'),(7,5,60,'2026-02-11')",
  "CREATE TABLE dim_producto(id integer primary key,nombre text,categoria text)",
  "INSERT INTO dim_producto VALUES(1,'Teclado','Informática'),(2,'Ratón','Informática'),(3,'Libro','Lectura'),(4,'Cuaderno','Papelería')",
  "CREATE TABLE fact_ventas(id integer primary key,producto_id integer references dim_producto(id),monto numeric(10,2))",
  "INSERT INTO fact_ventas VALUES (1,1,45),(2,2,25),(3,3,60),(4,1,80),(5,4,20),(6,3,30)"
];
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
  const db=await connect(),start=performance.now(),result=await db.query(safeQuery(sql));
  return{fields:(result.fields||[]).map(x=>x.name),rows:result.rows||[],duration:Math.round(performance.now()-start)};
}
function normalize(result){return result.rows.map(row=>JSON.stringify(Object.values(row).map(x=>typeof x==='bigint'?String(x):x))).sort()}
export async function evaluateSQL(sql,expected){
  const db=await connect();const [actual,target]=await Promise.all([db.query(safeQuery(sql)),db.query(safeQuery(expected))]);
  const a=normalize(actual),b=normalize(target);return{pass:a.length===b.length&&a.every((x,i)=>x===b[i]),expectedCount:b.length};
}
