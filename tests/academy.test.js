import test from 'node:test';
import assert from 'node:assert/strict';
import {SUBJECTS,TOTAL_LABS,getLab,getSubject} from '../src/campus/catalog.js';
import {LESSONS,getLesson} from '../src/campus/lessons.js';
import {EXTRA_LABS,validateExtraFor} from '../src/campus/curriculum.js';
import {lessonFor,checkMission} from '../src/campus/academy.js';
import {BDA_GUIDES} from '../src/campus/bda-guides.js';
import {MATH_TYPES} from '../src/campus/math.js';
import {COMPUTING_TYPES} from '../src/campus/computing.js';
import {APPLIED_TYPES} from '../src/campus/applied.js';
import {MANAGEMENT_TYPES} from '../src/campus/management.js';

test('Cobertura pedagógica completa de los 48 motores y 180 prácticas',()=>{
 assert.equal(SUBJECTS.length,30);assert.equal(TOTAL_LABS,180);
 assert.equal(validateExtraFor(SUBJECTS),115);
 const types=new Set([...MATH_TYPES,...COMPUTING_TYPES,...APPLIED_TYPES,...MANAGEMENT_TYPES,'bda']);
 assert.equal(types.size,48);
 assert.equal(Object.keys(LESSONS).length,48);
 for(const type of types){
  const lesson=getLesson(type);assert.ok(lesson,type);
  assert.ok(lesson.concept.length>=70,type+' explicación demasiado breve');
  assert.equal(lesson.workedExample.length,3,type+' ejemplo');
  assert.equal(lesson.hints.length,3,type+' pistas');
  assert.ok(lesson.workedExample.every(t=>t.length>=28),type);
  assert.ok(lesson.hints.every(t=>t.length>=14),type);
  assert.ok(lesson.pitfall.length>30,type);
 }
 for(const subject of SUBJECTS){
  assert.equal(subject.labs.length,6,subject.id);
  for(const lab of subject.labs){
    const l=lessonFor(lab);
    assert.ok(l.challenge.length>28,lab.id+' sin reto claro');
    assert.ok(l.concept&&l.hints.length===3,lab.id);
    if(lab.type!=='bda')assert.ok(l.verify.length>0,lab.id+' sin objetivo verificable');
  }
 }
 assert.equal(Object.keys(BDA_GUIDES).length,8);
 for(const [mode,guide] of Object.entries(BDA_GUIDES))assert.equal(guide.steps.length,3,mode);
});

test('Cada nueva práctica tiene su propio texto y rutas sin romper las antiguas',()=>{
 const ids=new Set;
 for(const subject of SUBJECTS){
  for(const l of subject.labs){
   assert.ok(!ids.has(l.id),l.id);ids.add(l.id);
   assert.equal(getLab(l.id).subjectId,subject.id);
  }
 }
 assert.equal(getSubject('FPR').id,'FPG');
 assert.equal(getLab('amd-1').type,'matrix');
 assert.equal(getLab('bda-1').type,'bda');
});

test('Comprobar misión no premia solo abrir el simulador',()=>{
 globalThis.CSS={escape:x=>x};
 const root={querySelector:s=>({'#angle':{type:'range',value:'90'},'#modo':{type:'checkbox',checked:true}})[s]||null};
 assert.equal(checkMission('angle=90',root,{}).ok,false);
 assert.equal(checkMission('angle=90',root,{'input:angle':1}).ok,true);
 assert.equal(checkMission('angle=90&@step=2',root,{'input:angle':1,step:1}).ok,false);
 assert.equal(checkMission('angle=90&@step=2',root,{'input:angle':1,step:2}).ok,true);
 assert.equal(checkMission('modo=true',root,{'input:modo':1}).ok,true);
 assert.equal(checkMission('angle=60',root,{'input:angle':1}).ok,false);
 assert.equal(checkMission('@input=3',root,{input:2}).ok,false);
 assert.equal(checkMission('@input=3',root,{input:3}).ok,true);
});
