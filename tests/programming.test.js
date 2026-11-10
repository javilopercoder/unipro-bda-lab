import test from 'node:test';
import assert from 'node:assert/strict';
import {runPseudocode,evaluateArithmetic} from '../src/campus/pseudocode.js';
import {parseMethodOverride} from '../src/campus/oop-editor.js';

test('Intérprete didáctico: suma acumulada hasta N, con traza',()=>{
 const program='suma = 0\nfor i in range(1, N + 1):\n    suma = suma + i\nprint(suma)';
 const r=runPseudocode(program,6);
 assert.equal(r.variables.suma,21);
 assert.equal(r.iterations,6);
 assert.deepEqual(r.output,[21]);
 assert.equal(r.trace.length,8);
 assert.equal(r.trace[1].variables.suma,1);
 assert.equal(r.trace.at(-1).variables.suma,21);
});
test('Intérprete: expresiones y programas personalizados',()=>{
 assert.equal(evaluateArithmetic('2*(N+3)',{N:7}),20);
 assert.equal(evaluateArithmetic('-2 + 3 * 5'),13);
 const result=runPseudocode('producto = 1\nfor i in range(1, N + 1):\n    producto = producto * i\nprint(producto)',5);
 assert.equal(result.output[0],120);
});
test('Intérprete: rechaza ejecución arbitraria, división por cero y rangos excesivos',()=>{
 assert.throws(()=>runPseudocode(''),/vacío/);
 assert.throws(()=>runPseudocode('import os'),/Solo se admiten/);
 assert.throws(()=>runPseudocode('for i in range(1, 1000):\n    suma = 1'),/rango/);
 assert.throws(()=>evaluateArithmetic('2/0'),/cero/);
 assert.throws(()=>evaluateArithmetic('process.exit()'),/símbolos/);
});
test('OOP: interpreta métodos permitidos sin ejecutar JavaScript',()=>{
 assert.deepEqual(parseMethodOverride('class Bicicleta extends Vehiculo { mover() { return "pedalea"; } }'),{kind:'Bicicleta',message:'pedalea'});
 assert.deepEqual(parseMethodOverride('class Coche { mover() { return "acelera"; } }'),{kind:'Coche',message:'acelera'});
 assert.throws(()=>parseMethodOverride('console.log(1)'),/Utiliza class/);
 assert.throws(()=>parseMethodOverride(''),/no has escrito/);
});
