import test from 'node:test';
import assert from 'node:assert/strict';
import {fictionalName,fictionalEmail} from '../src/demo-data.js';
import {createQueryHistory,formatBytes} from '../src/data-dashboard.js';
import {RedisSim} from '../src/redis.js';
import {segments} from '../src/analytics.js';

test('Datos reproducibles con cientos de nombres diferenciables',()=>{
 const names=Array.from({length:400},(_,i)=>fictionalName(i+100));
 assert.ok(new Set(names).size>100);
 assert.equal(fictionalName(120),fictionalName(120));
 assert.equal(fictionalEmail(120),'persona0120@ejemplo.test');
 assert.ok(segments().length>100);
});
test('Historial local limitado y reutilizable',()=>{
 const h=createQueryHistory(2);
 assert.equal(h.last(),null);
 h.add({engine:'SQL',sql:'SELECT 1',rows:1,duration:9});
 h.add({engine:'Mongo',sql:'db.clientes.find({})',rows:2505});
 h.add({engine:'SQL',sql:'SELECT 2',error:'prueba'});
 assert.equal(h.list().length,2);
 assert.equal(h.last().sql,'SELECT 2');
 h.clear();assert.equal(h.list().length,0);
});
test('Inventario Redis: ejemplos opcionales, tipos y tamaños',()=>{
 const sim=new RedisSim;
 assert.deepEqual(sim.snapshot(),[]);
 assert.equal(sim.seedDemo(),10);
 const rows=sim.snapshot();
 assert.equal(rows.length,10);
 assert.ok(rows.every(x=>x.bytes>=1&&x.ttl===-1));
 assert.equal(sim.execute('GET config:tema'),'oscuro');
 sim.execute('FLUSHDB');
 assert.deepEqual(sim.snapshot(),[]);
 assert.equal(formatBytes(2048),'2.0 KiB');
 assert.equal(formatBytes(null),'No disponible');
});
