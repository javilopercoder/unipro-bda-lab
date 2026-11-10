import test from 'node:test';
import assert from 'node:assert/strict';
import {criticalPath,earnedValue,breakEven,cashProjection,netPresentValue,scoreChannels,MANAGEMENT_TYPES} from '../src/campus/management.js';

test('Camino crítico y holguras calculadas con dependencias',()=>{
 const plan=criticalPath([{id:'A',duration:3,deps:[]},{id:'B',duration:5,deps:['A']},{id:'C',duration:2,deps:['A']},{id:'D',duration:4,deps:['B','C']}]);
 assert.equal(plan.duration,12);
 assert.deepEqual(plan.tasks.filter(t=>t.critical).map(t=>t.id),['A','B','D']);
 assert.equal(plan.tasks.find(t=>t.id==='C').slack,3);
 assert.throws(()=>criticalPath([{id:'A',duration:1,deps:['B']},{id:'B',duration:1,deps:['A']}]),/circulares/);
 assert.throws(()=>criticalPath([{id:'A',duration:0,deps:[]}]),/mayores/);
});

test('Valor ganado: CPI, SPI, EV, PV y AC',()=>{
 const a=earnedValue({budget:100000,planned:70,complete:50,spent:60000});
 assert.deepEqual({pv:a.pv,ev:a.ev,ac:a.ac,sv:a.sv,cv:a.cv},{pv:70000,ev:50000,ac:60000,sv:-20000,cv:-10000});
 assert.ok(Math.abs(a.cpi-5/6)<1e-9);assert.ok(Math.abs(a.spi-5/7)<1e-9);
});
test('Empresa: punto muerto, caja y VAN',()=>{
 const b=breakEven({price:50,variable:20,fixed:1000,demand:40});
 assert.equal(b.units,34);assert.equal(b.profit,200);
 assert.equal(breakEven({price:5,variable:8,fixed:1000,demand:20}).units,null);
 const cash=cashProjection({initial:500,revenue:100,expenses:200,growth:0,months:6});
 assert.equal(cash.length,6);assert.equal(cash[4].balance,0);assert.equal(cash[5].balance,-100);
 const npv=netPresentValue({investment:100,cash:60,rate:0,years:2});
 assert.equal(npv.npv,20);
});
test('Comunicación: puntuación ordenada para diferentes parámetros',()=>{
 for(const args of [{urgency:0,complexity:10,sensitivity:10,people:40},{urgency:10,complexity:0,sensitivity:0,people:2}]){
  const channels=scoreChannels(args);assert.equal(channels.length,4);
  for(let i=1;i<channels.length;i++)assert.ok(channels[i-1].score>=channels[i].score);
 }
 assert.equal(MANAGEMENT_TYPES.size,12);
});
