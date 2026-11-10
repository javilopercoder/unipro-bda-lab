import test from 'node:test';
import assert from 'node:assert/strict';
import {runSQL,evaluateSQL,safeQuery,SQL_DATA_COUNTS} from '../src/postgres.js';
test('PostgreSQL real: SQL y equivalencia por filas',async()=>{
 assert.ok((await runSQL("SELECT nombre FROM clientes WHERE ciudad='Madrid'")).rows.length>100);
 assert.deepEqual(SQL_DATA_COUNTS,{clientes:1205,pedidos:6007,productos:64,ventas:8006});
 for(const [table,expected] of Object.entries({clientes:1205,pedidos:6007,dim_producto:64,fact_ventas:8006})){
  const result=await runSQL('SELECT count(*)::integer AS n FROM '+table);
  assert.equal(result.rows[0].n,expected,table);
 }
 assert.equal((await evaluateSQL("SELECT nombre FROM clientes WHERE ciudad='Madrid' ORDER BY nombre DESC","SELECT nombre FROM clientes WHERE ciudad='Madrid'")).pass,true);
 assert.equal((await evaluateSQL("SELECT nombre FROM clientes WHERE ciudad='Sevilla'","SELECT nombre FROM clientes WHERE ciudad='Madrid'")).pass,false);
});
test('Editor restringido a consultas',()=>{
 assert.throws(()=>safeQuery('DELETE FROM clientes'));
 assert.throws(()=>safeQuery('SELECT 1; DROP TABLE clientes'));
 assert.equal(safeQuery('EXPLAIN SELECT 1'),'EXPLAIN SELECT 1');
});
