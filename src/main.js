import './campus/campus.css';
import {mountThemeToggle} from './theme.js';
import {SUBJECTS,YEARS,TOTAL_LABS,getSubject,getLab} from './campus/catalog.js';
import {MATH_TYPES,renderMath} from './campus/math.js';
import {COMPUTING_TYPES,renderComputing} from './campus/computing.js';
import {APPLIED_TYPES,renderApplied} from './campus/applied.js';
import {MANAGEMENT_TYPES,renderManagement} from './campus/management.js';
import {lessonIntro,missionMarkup,mountMission,mountExampleStepper} from './campus/academy.js';
const app=document.querySelector('#app'),KEY='unipro-lab-progress-v1';
let progress={};try{progress=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch{}
const MISSION_KEY='unipro-lab-completed-v2';let completed={};try{completed=JSON.parse(localStorage.getItem(MISSION_KEY)||'{}')||{}}catch{}
const completedCount=()=>Object.keys(completed).filter(id=>completed[id]).length;
const labelProgress=id=>completed[id]?'✓ Misión realizada':progress[id]?'✓ Practicado':'Interactivo';
const completeMission=id=>{completed[id]=Date.now();try{localStorage.setItem(MISSION_KEY,JSON.stringify(completed))}catch{};document.querySelectorAll('[data-progress="'+id+'"]').forEach(x=>x.textContent=labelProgress(id))};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(progress))}catch{}};
const mark=id=>{if(!progress[id]){progress[id]=Date.now();save();document.querySelectorAll('[data-progress="'+id+'"]').forEach(x=>x.textContent=labelProgress(id))}};
const esc=x=>String(x??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const icon={matrix:'⊞',logic:'◧',graph:'◇',circuit:'ϟ',calculus:'∫',roots:'√',statistics:'▥',montecarlo:'⚄',scheduler:'▧',network:'⌗',terminal:'⌘',oop:'{}',dataset:'▤',crypto:'⛨',bda:'⌘',graphics:'△',kmeans:'◉'};
const symbol=type=>icon[type]||'◇',count=s=>s.labs.filter(l=>progress[l.id]).length;
const page=()=>document.querySelector('#content-inner');
const route=()=>{const p=(location.hash||'#/').slice(1).split('/');return{view:p[1]||'home',id:p[2]}};
app.innerHTML='<a class="skip-link" href="#content">Saltar al contenido</a><header class="app-header"><div class="head-inner"><a class="identity" href="#/"><span class="identity-icon">L</span><span><b>Laboratorio</b><small>Aprende haciendo</small></span></a><div class="head-side"><span>'+SUBJECTS.length+' asignaturas · '+TOTAL_LABS+' laboratorios</span><span class="head-statement">Sin test. Solo práctica.</span></div></div></header><div class="app-layout"><aside class="app-aside"><div class="aside-top"><span class="eyebrow">EXPLORA</span><a class="aside-home" href="#/">⌂ &nbsp; Todas las asignaturas</a><input id="aside-search" aria-label="Buscar asignaturas" placeholder="Buscar asignaturas…" autocomplete="off"><div id="aside-list"></div></div><p class="aside-foot">Todo ocurre en tu navegador. Tu avance se guarda aquí, sin enviar información a terceros.</p></aside><main id="content" tabindex="-1"><div id="content-inner"></div></main></div><footer>Laboratorio · Prácticas originales · Datos ficticios</footer>';
document.querySelector('#aside-search').oninput=renderAside;
mountThemeToggle(document.querySelector('.head-side'));
function renderAside(){const q=document.querySelector('#aside-search').value.toLocaleLowerCase('es'),r=route(),active=r.view==='asignatura'?r.id:r.view==='practica'?getLab(r.id)?.subjectId:null;
 document.querySelector('#aside-list').innerHTML=YEARS.map(y=>{const list=SUBJECTS.filter(s=>s.year===y.id&&(s.name+' '+s.id).toLocaleLowerCase('es').includes(q));return list.length?'<section class="aside-group"><h3>'+y.label+'</h3>'+list.map(s=>'<a class="aside-subject '+(active===s.id?'active':'')+'" href="#/asignatura/'+s.id+'"><span>'+symbol(s.labs[0].type)+'</span>'+esc(s.name)+'</a>').join('')+'</section>':''}).join('')||'<p class="small-muted">Sin resultados</p>'}
const subjectCard=s=>'<a class="subject-card" href="#/asignatura/'+s.id+'"><span class="subject-icon">'+symbol(s.labs[0].type)+'</span><span class="subject-card-copy"><small>'+(s.year===4?'OPTATIVA':'CURSO '+s.year)+' · '+s.id+'</small><h3>'+esc(s.name)+'</h3><p>'+esc(s.topics.join(' · '))+'</p><span class="subject-meta">'+s.labs.length+' laboratorios · '+count(s)+' practicados</span></span><span class="card-arrow">↗</span></a>';
function renderHome(){page().innerHTML='<section class="hero"><div><span class="eyebrow">CAMPUS DE LABORATORIOS</span><h1>Aprende haciendo.<br><em>Sin marcar casillas.</em></h1><p>Manipula datos, programa soluciones y simula sistemas. Explora áreas de informática, resuelve casos y descubre qué hace cada herramienta con tus propias manos.</p><div class="hero-actions"><a class="primary-button" href="#/asignatura/BDA">Explorar bases de datos ↗</a><a class="secondary-button" href="#/asignatura/AMD">Empezar por Álgebra</a></div></div><div class="hero-art" aria-hidden="true"><div class="terminal-card"><span>● ● ●</span><code>&gt; iniciar campus</code><code>✓ '+SUBJECTS.length+' asignaturas</code><code>&gt; ejecutar simulaciones</code><code>✓ '+TOTAL_LABS+' laboratorios</code><code>&gt; seguir practicando_</code></div></div></section><div class="metrics"><div><b>'+SUBJECTS.length+'</b><span>Asignaturas técnicas</span></div><div><b>'+TOTAL_LABS+'</b><span>Prácticas disponibles</span></div><div><b>'+completedCount()+'</b><span>Misiones realizadas en este navegador</span></div></div><section class="getting-started" aria-label="Cómo aprender desde cero"><h2>¿Es tu primera vez? Así se aprende aquí</h2><div class="getting-started-grid"><div><span>01</span><h3>Entiende el ejemplo</h3><p>Explicamos la idea con palabras sencillas y resolvemos un caso paso a paso.</p></div><div><span>02</span><h3>Prueba sin miedo</h3><p>Cambia datos, ejecuta operaciones y observa qué pasa. Nada afecta a tu equipo ni a datos reales.</p></div><div><span>03</span><h3>Consigue la misión</h3><p>Hay tres pistas si te atascas. Comprueba tu objetivo y revisa los errores habituales.</p></div></div></section><div class="section-header"><h2>Explora el plan de estudios</h2><select id="course-filter"><option value="all">Todos los cursos</option>'+YEARS.map(y=>'<option value="'+y.id+'">'+y.label+'</option>').join('')+'</select></div><div id="subject-grid"></div>';
 const draw=()=>{const filter=document.querySelector('#course-filter').value;document.querySelector('#subject-grid').innerHTML=YEARS.filter(y=>filter==='all'||String(y.id)===filter).map(y=>'<section class="year-block"><h3>'+y.label+'</h3><div class="subject-grid">'+SUBJECTS.filter(s=>s.year===y.id).map(subjectCard).join('')+'</div></section>').join('')};document.querySelector('#course-filter').onchange=draw;draw()}
function renderSubject(id){
 const s=getSubject(id);if(!s){page().textContent='Asignatura desconocida';return}
 const explored=count(s),done=s.labs.filter(l=>completed[l.id]).length;
 page().innerHTML='<div class="breadcrumbs"><a href="#/">Inicio</a> / '+(s.year===4?'Optativas':'Curso '+s.year)+'</div>'+
  '<section class="subject-hero"><span class="subject-icon big">'+symbol(s.labs[0].type)+'</span><div><span class="eyebrow">'+(s.year===4?'OPTATIVA':'CURSO '+s.year)+'</span><h1>'+esc(s.name)+'</h1><p>'+esc(s.topics.join(' · '))+'</p><div class="tags"><span>'+s.labs.length+' prácticas</span><span>'+explored+' exploradas</span><span>'+done+' misiones realizadas</span></div></div></section>'+
  '<div class="subject-learning-strip"><div><b>Aprende siguiendo un caso</b><p>Empieza por el ejemplo, explora el simulador y resuelve una misión. Cada práctica tiene pistas y explicación.</p></div><span>Tu ritmo, tus decisiones</span></div>'+
  '<div class="section-header"><h2>Elige un laboratorio</h2><span class="subject-lab-count">'+s.labs.length+' experiencias</span></div>'+
  '<div class="labs-grid">'+s.labs.map((l,index)=>'<a class="lab-card" href="#/practica/'+l.id+'"><div class="lab-card-top"><span class="lab-symbol">'+symbol(l.type)+'</span><span data-progress="'+l.id+'">'+labelProgress(l.id)+'</span></div><span class="lab-number">ACTIVIDAD '+String(index+1).padStart(2,'0')+'</span><h3>'+esc(l.title)+'</h3><p>'+esc(l.topic)+'</p><span class="lab-link">Entrar y experimentar ↗</span></a>').join('')+'</div>';
}
function renderLab(id){
 const lab=getLab(id);if(!lab){page().textContent='Laboratorio desconocido';return}
 const subject=getSubject(lab.subjectId);
 const breadcrumbs='<div class="breadcrumbs"><a href="#/">Inicio</a> / <a href="#/asignatura/'+subject.id+'">'+esc(subject.name)+'</a> / '+esc(lab.topic)+'</div>';
 const title='<section class="lab-heading"><div><span class="eyebrow">'+subject.id+' · '+esc(lab.topic)+'</span><h1>'+esc(lab.title)+'</h1><p>Descubre la idea, observa un ejemplo y pruébalo a tu manera.</p></div><span class="tag" data-progress="'+lab.id+'">'+(completed[lab.id]?'✓ Misión realizada':progress[lab.id]?'✓ Practicado':'Sin practicar')+'</span></section>';
 if(lab.type==='bda'){
  const mode=({'bda-1':'sql','bda-3':'sql','bda-4':'mongo','bda-5':'xml','bda-6':'transactions'})[lab.id]||'sql';
  page().innerHTML=breadcrumbs+title+lessonIntro(lab,subject)+
  '<section class="lab-shell bda-bridge"><span class="lesson-kicker">ABRE EL ENTORNO DE PRÁCTICAS</span><h2>Tu siguiente paso: experimentar con datos</h2><p>Aquí encontrarás consultas, ejemplos y pistas en un espacio independiente. SQL se ejecuta en el navegador; los demás módulos indican cuándo son simulaciones.</p><a class="primary-button" href="./bda.html#'+mode+'">Entrar en '+esc(lab.title)+' ↗</a></section>'+
  '<div class="lab-footer"><a href="#/asignatura/BDA">← Más prácticas de bases de datos</a><span>Datos de ejemplo y ejecución local</span></div>';
  mountExampleStepper(page());
  const link=page().querySelector('.bda-bridge a.primary-button');if(link)link.addEventListener('click',()=>mark(lab.id));
  return;
 }
 page().innerHTML=breadcrumbs+title+lessonIntro(lab,subject)+
  '<div class="lab-workspace"><section class="lab-shell"><h2 class="lab-stage">EXPERIMENTA</h2><div id="lab-root"></div></section>'+missionMarkup(lab)+'</div>'+
  '<div class="lab-footer"><a href="#/asignatura/'+subject.id+'">← Más prácticas de esta materia</a><span>Actividad interactiva, sin calificaciones</span></div>';
 mountExampleStepper(page());
 const root=document.querySelector('#lab-root');
 root.addEventListener('input',event=>{if(event.target.matches('input[type="range"]')){const display=root.querySelector('[data-value="'+CSS.escape(event.target.id)+'"]');if(display)display.textContent=event.target.value;}});
 for(const event of ['click','input','change'])root.addEventListener(event,e=>{if(e.isTrusted&&(e.target.closest('button,input,select,textarea,svg')))mark(lab.id)});
 try{
  if(MATH_TYPES.has(lab.type))renderMath(root,lab,()=>{});
  else if(COMPUTING_TYPES.has(lab.type))renderComputing(root,lab);
  else if(APPLIED_TYPES.has(lab.type))renderApplied(root,lab);
  else if(MANAGEMENT_TYPES.has(lab.type))renderManagement(root,lab);
  else throw Error('Sin motor asociado al laboratorio: '+lab.type);
  mountMission(root,lab,completeMission);
 }catch(err){console.error(err);root.innerHTML='<div class="error-box"><b>Error en el laboratorio</b><p>'+esc(err.message||err)+'</p></div>'}
}
function render(){renderAside();const r=route();if(r.view==='asignatura')renderSubject(r.id);else if(r.view==='practica')renderLab(r.id);else renderHome();window.scrollTo(0,0)}
window.addEventListener('hashchange',render);render();
