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
export function lessonIntro(lab,subject){
 const lesson=lessonFor(lab);
 const steps=lesson.workedExample.map((step,i)=>'<li><span class="lesson-step-number">'+(i+1)+'</span><p>'+escapeHTML(step)+'</p></li>').join('');
 return '<section class="lesson-panel" aria-label="Aprender antes de practicar"><div class="lesson-panel-head"><div><span class="lesson-kicker">01 · ENTENDER</span><h2>Primero, entiende lo que estás haciendo</h2></div><span class="lesson-time">≈ 2 minutos</span></div><p class="lesson-concept">'+escapeHTML(lesson.concept)+'</p><div class="lesson-example"><h3>💡 Ejemplo resuelto, paso a paso</h3><ol>'+steps+'</ol></div><p class="lesson-basis"><b>Contexto:</b> '+escapeHTML(subject.name)+' · '+escapeHTML(lab.topic)+'. '+(subject.source==='apuntes'?'Práctica original orientada por los materiales disponibles.':'Práctica provisional inspirada en la guía docente; se revisará con los apuntes originales.')+'</p><div class="lesson-preflight"><b>🎯 Tu objetivo en este laboratorio</b><p>'+escapeHTML(lesson.challenge)+'</p></div></section>';
}
export function missionMarkup(lab){
 const lesson=lessonFor(lab);
 return '<section class="mission-panel" aria-label="Misión guiada"><div class="mission-title"><span class="lesson-kicker">03 · TU MISIÓN</span><h2>Ahora te toca a ti</h2></div><p class="mission-challenge">'+escapeHTML(lesson.challenge)+'</p><div class="mission-actions"><button type="button" id="mission-check" class="btn">✓ Comprobar mi misión</button><button type="button" id="mission-hint" class="btn mission-secondary">💡 Dame una pista</button></div><div id="mission-feedback" role="status" class="mission-feedback" aria-live="polite">Los controles de arriba son interactivos. Cambia sus valores y comprueba tu objetivo. Esto no es un examen.</div><div id="mission-hints" class="mission-hints" aria-live="polite"></div><details class="mission-details"><summary>⚠️ Error típico y por qué importa</summary><p>'+escapeHTML(lesson.pitfall)+'</p></details><details class="mission-details"><summary>🧠 Para entenderlo de verdad</summary><p>'+escapeHTML(lesson.reflection)+'</p><p>Intenta explicarlo con tus palabras antes de mirar la solución del ejemplo.</p></details></section>';
}
export function mountMission(root,lab,complete){
 const lesson=lessonFor(lab),hintBox=document.querySelector('#mission-hints'),feedback=document.querySelector('#mission-feedback');
 const events=Object.create(null);const touchedFields=new Set();let hintCount=0;
 const increment=name=>{events[name]=(events[name]||0)+1};
 const recordInput=ev=>{
  if(!ev.isTrusted)return;
  const id=ev.target.id||'(sin-id)';
  if(!touchedFields.has(id)){touchedFields.add(id);increment('input')}
  if(ev.target.id)increment('input:'+ev.target.id);
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
