import {getLesson} from './lessons.js';

const escapeHTML=text=>String(text??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

/** El motor pertenece al laboratorio; este módulo nunca ejecuta código arbitrario. */
export function checkMission(requirementText,root,events){
 const tests=String(requirementText||'').split('&').map(s=>s.trim()).filter(Boolean);
 if(!tests.length)return {ok:false,details:['Este laboratorio se explora desde su módulo especializado.']};
 const details=tests.map(test=>{
  const index=test.lastIndexOf('='),key=test.slice(0,index),expected=test.slice(index+1);
  if(index<=0)return{ok:false,text:'Condición de reto no definida.'};
  if(key.startsWith('@')){
    const name=key.slice(1);
    const amount=events[name]||0;
    const goal=Number(expected);
    const label=name==='button'?'Acciones realizadas: ':name==='input'?'Cambios realizados: ':'Acciones '+name+': ';
    return{ok:amount>=goal,text:label+amount+'/'+goal};
  }
  const field=root.querySelector('#'+CSS.escape(key));
  if(!field)return{ok:false,text:'No se ha encontrado el control '+key+'.'};
  const actual=field.type==='checkbox'?String(field.checked):String(field.value);
  const ok=actual===expected||(actual!==''&&Number.isFinite(Number(actual))&&Number.isFinite(Number(expected))&&Number(actual)===Number(expected));
  const changed=events['input:'+key]||0;
  const practiced=changed>0||(events.button||0)>0;
  return{ok:ok&&practiced,text:key+': '+actual+(ok&&practiced?' ✓':' (objetivo: '+expected+'; interactúa con la práctica)')};
 });
 return{ok:details.every(x=>x.ok),details:details.map(x=>x.text)};
}
export function lessonFor(lab){
 const base=getLesson(lab.type);
 if(!base)throw Error('Falta microlección del motor '+lab.type);
 return {...base,challenge:lab.challenge||base.challenge,verify:lab.verify??base.verify};
}
function exampleStep(step,index,type){
  if(type==='matrix'&&index===0){
    const values=[1,2,0,0,1,3,2,0,1];
    return '<li class="lesson-step is-current" data-example-step="0"><div class="lesson-step-visual"><div class="lesson-step-minihead">Matriz A · Ejemplo resuelto</div><div class="lesson-matrix-demo"><span class="lesson-matrix-bracket"></span><div class="lesson-matrix-values">'+values.map(x=>'<span>'+x+'</span>').join('')+'</div><span class="lesson-matrix-bracket end"></span></div><p>Los nueve valores están organizados en tres filas y tres columnas.</p></div></li>';
  }
  return '<li class="lesson-step '+(index===0?'is-current':'')+'" data-example-step="'+index+'"><span class="lesson-step-index">'+(index+1).toString().padStart(2,'0')+'</span><p>'+escapeHTML(step)+'</p></li>';
}
export function lessonIntro(lab,subject){
 const lesson=lessonFor(lab);
 const steps=lesson.workedExample.map((step,i)=>exampleStep(step,i,lab.type)).join('');
 return '<section class="lesson-panel" aria-label="Aprende con un ejemplo">'+
  '<div class="lesson-panel-head"><span class="lesson-kicker">LA IDEA EN 20 SEGUNDOS</span><span class="lesson-time">'+escapeHTML(lab.topic)+'</span></div>'+
  '<p class="lesson-concept">'+escapeHTML(lesson.concept)+'</p>'+
  '<div class="lesson-grid"><div class="lesson-example">'+
  '<div class="lesson-example-head"><h2>Así funciona. Mira este ejemplo.</h2><span class="example-progress" id="example-progress">1 / 3</span></div>'+
  '<ol class="example-steps">'+steps+'</ol>'+
  '<div class="example-controls"><button type="button" id="example-prev" class="example-button" disabled>← Anterior</button><span class="example-dots" id="example-dots" aria-hidden="true"><i class="active"></i><i></i><i></i></span><button type="button" id="example-next" class="example-button primary">Siguiente paso →</button></div>'+
  '</div><div class="lesson-preflight"><span class="lesson-kicker">DESPUÉS, INTÉNTALO</span><h3>Tu siguiente movimiento</h3><p>'+escapeHTML(lesson.challenge)+'</p><div class="lesson-preflight-foot"><span>✓ Experimenta</span><span>✓ Comprueba</span><span>✓ Comprende</span></div></div></div>'+
  '</section>';
}
export function missionMarkup(lab){
 const lesson=lessonFor(lab);
 return '<section class="mission-panel" aria-label="Misión guiada"><div class="mission-title"><span class="lesson-kicker">TU MISIÓN</span><h2>Ponlo a prueba</h2></div>'+
  '<p class="mission-challenge">'+escapeHTML(lesson.challenge)+'</p>'+
  '<p class="mission-coach">El objetivo es explorar los controles y entender por qué cambia el resultado. No hay límite de intentos.</p>'+
  '<div class="mission-actions"><button type="button" id="mission-check" class="btn">Comprobar resultado</button><button type="button" id="mission-hint" class="btn mission-secondary">Dame una pista</button></div>'+
  '<div id="mission-feedback" role="status" class="mission-feedback" aria-live="polite">Cuando lo tengas, comprueba tu resultado. Puedes usar las pistas cuando quieras.</div>'+
  '<div id="mission-hints" class="mission-hints" aria-live="polite"></div>'+
  '<details class="mission-details"><summary>Lo que suele confundirse</summary><p>'+escapeHTML(lesson.pitfall)+'</p></details>'+
  '<details class="mission-details"><summary>Una pregunta para ir un paso más allá</summary><p>'+escapeHTML(lesson.reflection)+'</p></details></section>';
}
export function mountExampleStepper(container){
 if(!container)return;
 const steps=[...container.querySelectorAll('[data-example-step]')];
 if(steps.length===0)return;
 const previous=container.querySelector('#example-prev'),next=container.querySelector('#example-next'),counter=container.querySelector('#example-progress'),dots=container.querySelector('#example-dots');
 let current=0;
 const draw=()=>{
   steps.forEach((step,index)=>{step.classList.toggle('is-current',index===current);step.setAttribute('aria-hidden',String(index!==current))});
   counter.textContent=(current+1)+' / '+steps.length;
   previous.disabled=current===0;
   next.textContent=current===steps.length-1?'Volver al principio ↻':'Siguiente paso →';
   dots.innerHTML=steps.map((_,index)=>'<i class="'+(index===current?'active':'')+'"></i>').join('');
 };
 previous.onclick=()=>{current=Math.max(0,current-1);draw()};
 next.onclick=()=>{current=(current+1)%steps.length;draw()};
 draw();
}
export function mountMission(root,lab,complete){
 const lesson=lessonFor(lab),hintBox=document.querySelector('#mission-hints'),feedback=document.querySelector('#mission-feedback');
 const events=Object.create(null);const touchedFields=new Set();let hintCount=0;
 const increment=name=>{events[name]=(events[name]||0)+1};
 const recordInput=ev=>{
  if(!ev.isTrusted)return;
  const id=ev.target.dataset.rangeFor||ev.target.id||'(sin-id)';
  if(!touchedFields.has(id)){touchedFields.add(id);increment('input')}
  if(id!=='(sin-id)')increment('input:'+id);
 };
 const recordClick=ev=>{
  if(!ev.isTrusted)return;
  const b=ev.target.closest('button');
  if(b){increment('button');if(b.id)increment(b.id)}
 };
 root.addEventListener('input',recordInput);
 root.addEventListener('change',recordInput);
 root.addEventListener('click',recordClick);
 const btnHint=document.querySelector('#mission-hint');
 btnHint.onclick=()=>{
  if(hintCount>=lesson.hints.length)return;
  const p=document.createElement('p');
  const strong=document.createElement('b');strong.textContent='Pista '+(hintCount+1)+': ';
  p.append(strong,document.createTextNode(lesson.hints[hintCount]));
  hintBox.append(p);hintCount++;
  if(hintCount===lesson.hints.length){btnHint.disabled=true;btnHint.textContent='✓ Todas las pistas mostradas'}
 };
 document.querySelector('#mission-check').onclick=()=>{
  const result=checkMission(lesson.verify,root,events);
  feedback.classList.toggle('mission-success',result.ok);
  feedback.classList.toggle('mission-warning',!result.ok);
  if(result.ok){
    feedback.textContent='✓ ¡Misión realizada! Has completado los pasos interactivos. Ahora revisa «Para entenderlo de verdad» y explica qué ha cambiado.';
    complete(lab.id);
  }else{
    feedback.textContent='Todavía falta algo: '+result.details.join(' · ')+'. Puedes probar otra vez o pedir una pista.';
  }
 };
}
