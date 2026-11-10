import test from 'node:test';
import assert from 'node:assert/strict';
import {runSQL,evaluateSQL,safeQuery} from '../src/postgres.js';
test('PostgreSQL real: SQL y equivalencia por filas',async()=>{
 assert.equal((await runSQL("SELECT nombre FROM clientes WHERE ciudad='Madrid'")).rows.length,3);
 assert.equal((await evaluateSQL("SELECT nombre FROM clientes WHERE ciudad='Madrid' ORDER BY nombre DESC","SELECT nombre FROM clientes WHERE ciudad='Madrid'")).pass,true);
 assert.equal((await evaluateSQL("SELECT nombre FROM clientes WHERE ciudad='Sevilla'","SELECT nombre FROM clientes WHERE ciudad='Madrid'")).pass,false);
});
test('Editor restringido a consultas',()=>{
 assert.throws(()=>safeQuery('DELETE FROM clientes'));
 assert.throws(()=>safeQuery('SELECT 1; DROP TABLE clientes'));
 assert.equal(safeQuery('EXPLAIN SELECT 1'),'EXPLAIN SELECT 1');
});
