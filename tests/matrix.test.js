import test from 'node:test';
import assert from 'node:assert/strict';
import {sarrusProducts} from '../src/campus/matrix-lab.js';

test('Sarrus: ejemplo didáctico con diagonales y signo correctos',()=>{
 const {positive,negative,sumDown,sumUp,determinant}=sarrusProducts([1,2,0,0,1,3,2,0,1]);
 assert.deepEqual(positive.map(x=>x.value),[1,12,0]);
 assert.deepEqual(negative.map(x=>x.value),[0,0,0]);
 assert.equal(sumDown,13);assert.equal(sumUp,0);assert.equal(determinant,13);
});
test('Identidad, matriz singular y signos negativos',()=>{
 assert.equal(sarrusProducts([1,0,0,0,1,0,0,0,1]).determinant,1);
 assert.equal(sarrusProducts([1,2,3,2,4,6,1,0,1]).determinant,0);
 assert.equal(sarrusProducts([-1,0,0,0,2,0,0,0,3]).determinant,-6);
 assert.equal(sarrusProducts([0,0,0,0,0,0,0,0,0]).determinant,0);
});
test('El determinante rechaza matrices incompletas o inválidas',()=>{
 assert.throws(()=>sarrusProducts([1,2]),/nueve/);
 assert.throws(()=>sarrusProducts([1,2,3,4,5,6,7,8,NaN]),/nueve/);
});
