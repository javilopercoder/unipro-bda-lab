import test from 'node:test';
import assert from 'node:assert/strict';
import {SUBJECTS,YEARS,TOTAL_LABS,getLab,getSubject,QUIZ_CODE_ALIASES,quizToLabSubject} from '../src/campus/catalog.js';
import {MANAGEMENT_TYPES} from '../src/campus/management.js';
import {MATH_TYPES} from '../src/campus/math.js';
import {COMPUTING_TYPES,shortest} from '../src/campus/computing.js';
import {APPLIED_TYPES} from '../src/campus/applied.js';
test('30 asignaturas del plan sin TFG; todas con motores',()=>{
 assert.equal(SUBJECTS.length,30);
 assert.equal(TOTAL_LABS,65);
 const subjectIds=SUBJECTS.map(x=>x.id),labIds=SUBJECTS.flatMap(x=>x.labs.map(l=>l.id));
 assert.equal(new Set(subjectIds).size,30);
 assert.equal(new Set(labIds).size,65);
 assert.ok(!SUBJECTS.some(x=>/trabajo final|tfg/i.test(x.name)));
 for(const s of SUBJECTS){
  assert.ok(s.labs.length>=2,s.id);
  assert.ok(getSubject(s.id),s.id);
  assert.ok(YEARS.some(y=>y.id===s.year),s.id);
  for(const lab of s.labs){
   assert.ok(MATH_TYPES.has(lab.type)||COMPUTING_TYPES.has(lab.type)||APPLIED_TYPES.has(lab.type)||MANAGEMENT_TYPES.has(lab.type)||lab.type==='bda',lab.type);
   assert.equal(getLab(lab.id).subjectId,s.id);
  }
 }
});
test('Grafo: BFS minimiza saltos, Dijkstra coste ponderado',()=>{
 const bfs=shortest('A','G','bfs');
 const dijkstra=shortest('A','G','dijkstra');
 assert.ok(bfs.path.length>0&&dijkstra.path.length>0);
 assert.ok(dijkstra.dist<=11);
 assert.equal(dijkstra.path[0],'A');
 assert.equal(dijkstra.path.at(-1),'G');
});

test('Los siete IDs distintos de Google Sheets tienen ruta válida',()=>{
 const keys={FPR:'FPG',AYC:'ALC',EDD:'EDA',PRA:'PAD',EDC:'ESC',IGV:'IGR',AMD2:'AAM'};
 assert.deepEqual(QUIZ_CODE_ALIASES,keys);
 for(const [quiz,lab] of Object.entries(keys))assert.equal(getSubject(quiz).id,lab);
 for(const code of ['FEM','DYL','CYL','GDP'])assert.ok(getSubject(code));
});
