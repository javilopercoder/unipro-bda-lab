import test from 'node:test';
import assert from 'node:assert/strict';
import {runMongo,evaluateMongo,MONGO_DATA_COUNT,getMongoCatalog} from '../src/mongo.js';
import {RedisSim} from '../src/redis.js';
import {BankSim} from '../src/transactions.js';
import {rollup,segments,distributed,PURCHASE_COUNT} from '../src/analytics.js';
test('Mongo: filtros, proyecciones y agrupaciones',()=>{
 assert.equal(runMongo('db.clientes.find({})').length,MONGO_DATA_COUNT);
 assert.ok(runMongo('db.clientes.find({"ciudad":"Madrid"})').length>100);
 assert.equal(evaluateMongo('db.clientes.find({"ciudad":"Madrid"},{"nombre":1,"_id":0})','m2'),true);
 assert.equal(evaluateMongo('db.clientes.aggregate([{"$group":{"_id":"$ciudad","total":{"$sum":1}}},{"$sort":{"_id":1}}])','m3'),true);
 assert.throws(()=>runMongo('db.clientes.drop()'));
});
test('Redis: operaciones y borrado',()=>{
 const r=new RedisSim;assert.equal(r.execute('SET clave 3'),'OK');assert.equal(r.execute('GET clave'),'3');assert.equal(r.execute('INCR clave'),'(integer) 4');assert.equal(r.execute('DEL clave'),'(integer) 1');
});
test('Transferencias y rollback',()=>{
 const b=new BankSim;b.apply('BEGIN');b.apply('SAVEPOINT');b.apply('TRANSFER',{amount:100});b.apply('ROLLBACK TO');assert.equal(b.status().balances.Ana,1000);
 b.apply('TRANSFER',{amount:150});b.apply('COMMIT');assert.equal(b.status().balances.Ana,850);b.apply('BEGIN');b.apply('TRANSFER',{amount:100});b.apply('CRASH');assert.equal(b.status().balances.Ana,850);
});
test('OLAP y particiones didácticas',()=>{
 assert.equal(PURCHASE_COUNT,4007);assert.ok(rollup('region').find(x=>x.dimension==='Centro').total>650);assert.ok(segments().length>100);assert.ok(distributed({pushdown:true}).rowsTransferred<distributed({pushdown:false}).rowsTransferred);
});

test('Metadatos del simulador Mongo y nombres variados, sin alterar las consultas existentes',()=>{
 const catalog=getMongoCatalog(),collection=catalog.collections[0];
 assert.equal(collection.name,'clientes');
 assert.equal(collection.count,2505);
 assert.ok(collection.bytes>0);
 assert.ok(collection.fields.some(x=>x.name==='correo'));
 assert.ok(collection.fields.some(x=>x.name==='activo'));
 const preview=runMongo('db.clientes.find({"_id":6})');
 assert.equal(preview.length,1);
 assert.ok(!preview[0].nombre.startsWith('Cliente '));
 assert.ok(preview[0].correo.endsWith('@ejemplo.test'));
});
