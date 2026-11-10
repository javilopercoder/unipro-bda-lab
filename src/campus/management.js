// Laboratorios transversales: gestión, economía, comunicación y ética profesional.
// Ejemplos originales y datos ficticios. Las heurísticas no son evaluaciones legales ni personales.
const $=(root,id)=>id===undefined?document.querySelector(root):root.querySelector('#'+id);
const number=(root,id)=>Number($(root,id).value);
const fmt=(n,dec=2)=>Number.isFinite(n)?n.toLocaleString('es-ES',{minimumFractionDigits:dec,maximumFractionDigits:dec}):'—';
const safe=x=>String(x??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const slider=(id,name,min,max,value,step=1,unit='')=>'<label class="control"><span>'+name+' <b data-val="'+id+'">'+value+unit+'</b></span><input type="range" id="'+id+'" min="'+min+'" max="'+max+'" value="'+value+'" step="'+step+'" data-unit="'+unit+'"></label>';
const text=(id,name,value)=>'<label class="control"><span>'+name+'</span><input type="text" id="'+id+'" value="'+safe(value)+'"></label>';
const choice=(id,name,options)=>'<label class="control"><span>'+name+'</span><select id="'+id+'">'+options.map(x=>'<option value="'+x[0]+'">'+safe(x[1])+'</option>').join('')+'</select></label>';
const checks=(id,name)=>'<label class="control control-check"><input type="checkbox" id="'+id+'"> '+name+'</label>';
function mount(root,description,controls){root.innerHTML='<p class="lab-intro">'+description+'</p><div class="controls">'+controls+'</div><div class="output-card" id="mg-out" aria-live="polite"></div><div class="visual-card" id="mg-viz"></div>';return{out:$('#mg-out'),viz:$('#mg-viz')}}
function activate(root,callback){root.querySelectorAll('input,select').forEach(x=>x.addEventListener('input',()=>{const target=root.querySelector('[data-val="'+x.id+'"]');if(target)target.textContent=x.value+(x.dataset.unit||'');callback()}))}
const line=(x)=>'<p>'+safe(x)+'</p>';
function table(data){if(!data.length)return'<p>Sin resultados.</p>';const cols=Object.keys(data[0]);return'<div class="scroll-table"><table><thead><tr>'+cols.map(x=>'<th>'+safe(x)+'</th>').join('')+'</tr></thead><tbody>'+data.map(x=>'<tr>'+cols.map(k=>'<td>'+safe(x[k])+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>'}
export function criticalPath(tasks){
 if(!tasks.length)throw Error('Se necesitan actividades.');
 const map=new Map(tasks.map(t=>[t.id,{...t,duration:Number(t.duration),deps:[...(t.deps||[])]}]));
 if(map.size!==tasks.length)throw Error('Los identificadores de tareas deben ser únicos.');
 for(const t of map.values()){
  if(!Number.isFinite(t.duration)||t.duration<=0||t.duration>365)throw Error('Las duraciones deben ser mayores que cero y de 365 días como máximo.');
  for(const d of t.deps)if(!map.has(d)||d===t.id)throw Error('Dependencia inválida en '+t.id+': '+d);
 }
 const sorted=[],pending=new Set(map.keys());
 while(pending.size){const ready=[...pending].find(id=>map.get(id).deps.every(d=>sorted.includes(d)));if(!ready)throw Error('Dependencias circulares: revisa el orden de las tareas.');sorted.push(ready);pending.delete(ready)}
 const schedule=new Map;
 for(const id of sorted){const t=map.get(id),es=t.deps.length?Math.max(...t.deps.map(d=>schedule.get(d).ef)):0;schedule.set(id,{...t,es,ef:es+t.duration})}
 const makespan=Math.max(...[...schedule.values()].map(t=>t.ef));
 for(const id of [...sorted].reverse()){
  const successors=[...schedule.values()].filter(t=>t.deps.includes(id));
  const lf=successors.length?Math.min(...successors.map(t=>t.ls)):makespan;
  const t=schedule.get(id);t.lf=lf;t.ls=lf-t.duration;t.slack=t.ls-t.es;t.critical=Math.abs(t.slack)<1e-9;
 }
 return {duration:makespan,tasks:sorted.map(id=>schedule.get(id))};
}
export function earnedValue({budget,planned,complete,spent}){
 const pv=budget*planned/100,ev=budget*complete/100,ac=spent;
 return{pv,ev,ac,sv:ev-pv,cv:ev-ac,spi:pv?ev/pv:null,cpi:ac?ev/ac:null,eac:ev?budget*ac/ev:null};
}
export function breakEven({price,variable,fixed,demand}){
 const contribution=price-variable,units=contribution>0?Math.ceil(fixed/contribution):null;
 return {contribution,units,profit:demand*contribution-fixed,revenue:demand*price,cost:fixed+demand*variable};
}
export function cashProjection({initial,revenue,expenses,growth,months}){
 let cash=initial;const rows=[];for(let i=1;i<=months;i++){const income=revenue*Math.pow(1+growth/100,i-1);cash+=income-expenses;rows.push({month:i,income,expenses,balance:cash})}return rows;
}
export function netPresentValue({investment,cash,rate,years}){
 const rows=Array.from({length:years},(_,i)=>({year:i+1,discounted:cash/Math.pow(1+rate/100,i+1)}));
 return {npv:-investment+rows.reduce((s,r)=>s+r.discounted,0),rows};
}
export function scoreChannels({urgency,complexity,sensitivity,people}){
 // Ranking pedagógico, no norma. Reducimos exposición para datos sensibles.
 const scores=[
 {name:'Correo',score:50+complexity*2-urgency*2+Math.min(people,20),reason:'Deja registro y permite preparar contexto.'},
 {name:'Chat de equipo',score:62+urgency*2-complexity*3-sensitivity*2,reason:'Rápido para coordinar, limitado para decisiones complejas.'},
 {name:'Reunión',score:42+complexity*4+urgency-sensitivity,reason:'Permite aclarar matices y resolver dudas en directo.'},
 {name:'Documento compartido',score:35+complexity*3+people*.7-urgency*2,reason:'Mejor para documentación detallada y decisiones trazables.'}
 ];return scores.sort((a,b)=>b.score-a.score);
}
function renderGantt(root){
 const tasks=[{id:'A',title:'Requisitos',duration:3,deps:[]},{id:'B',title:'Diseño',duration:4,deps:['A']},{id:'C',title:'Infraestructura',duration:5,deps:['A']},{id:'D',title:'Implementación',duration:8,deps:['B']},{id:'E',title:'Pruebas',duration:4,deps:['C','D']},{id:'F',title:'Entrega',duration:2,deps:['E']}];
 const {out,viz}=mount(root,'Planifica un proyecto informático. Modifica duraciones y dependencias: calcula camino crítico, inicio, fin y holgura de cada tarea.','<button type="button" id="reset" class="btn">Restaurar proyecto</button>');
 const draw=()=>{
  try{
   const plan=criticalPath(tasks);
   out.innerHTML='<strong>Duración mínima: '+fmt(plan.duration,0)+' días · Camino crítico: '+safe(plan.tasks.filter(t=>t.critical).map(x=>x.id).join(' → '))+'</strong><p>Las tareas críticas tienen holgura cero. Cambia una duración para observar cómo afecta al proyecto.</p>';
   const head='<table><thead><tr><th>Tarea</th><th>Días</th><th>Depende de</th><th>Inicio</th><th>Fin</th><th>Holgura</th><th>Cronograma</th></tr></thead><tbody>';
   viz.innerHTML='<div class="scroll-table">'+head+plan.tasks.map(t=>'<tr><td><b>'+t.id+'</b> '+safe(t.title)+'</td><td><input type="number" min="1" max="365" class="plan-days" data-id="'+t.id+'" value="'+t.duration+'" aria-label="Duración '+t.id+'"></td><td><input type="text" class="plan-deps" data-id="'+t.id+'" value="'+safe(t.deps.join(','))+'" aria-label="Dependencias de '+t.id+'"></td><td>'+fmt(t.es,0)+'</td><td>'+fmt(t.ef,0)+'</td><td>'+fmt(t.slack,0)+'</td><td><div class="gantt-timeline"><span class="'+(t.critical?'critical':'')+'" style="margin-left:'+100*t.es/plan.duration+'%;width:'+100*t.duration/plan.duration+'%"></span></div></td></tr>').join('')+'</tbody></table></div><p class="subtle">En «Depende de» escribe letras separadas por comas. Puedes combinar varias dependencias. Los ejemplos no representan entregas oficiales.</p>';
  }catch(e){out.textContent=e.message;viz.textContent='Corrige las dependencias para recalcular el cronograma.'}
 };
 const attach=()=>{
  // Redibujar únicamente tras confirmar edición; input inmediato en cada tecla perdería el foco.
  viz.querySelectorAll('.plan-days,.plan-deps').forEach(el=>el.addEventListener('change',()=>{
   const t=tasks.find(x=>x.id===el.dataset.id);if(el.classList.contains('plan-days'))t.duration=Number(el.value);else t.deps=[...new Set(el.value.split(',').map(x=>x.trim().toUpperCase()).filter(Boolean))];draw();attach();
  }))
 };
 const initial=JSON.parse(JSON.stringify(tasks));
 $('#reset').onclick=()=>{tasks.splice(0,tasks.length,...JSON.parse(JSON.stringify(initial)));draw();attach()};
 draw();attach();
}
function renderEarned(root){
 const {out,viz}=mount(root,'Cambia el presupuesto, el avance esperado, el trabajo realmente realizado y el coste real. Calcula PV, EV, AC, CPI y SPI.',slider('budget','Presupuesto total (€)',5000,200000,60000,5000,' €')+slider('planned','Avance previsto',0,100,70,5,'%')+slider('complete','Trabajo completado',0,100,55,5,'%')+slider('spent','Coste real (€)',0,200000,40000,5000,' €'));
 const draw=()=>{const a=earnedValue({budget:number(root,'budget'),planned:number(root,'planned'),complete:number(root,'complete'),spent:number(root,'spent')});
  out.innerHTML='<strong>CPI: '+(a.cpi===null?'—':fmt(a.cpi))+' · SPI: '+(a.spi===null?'—':fmt(a.spi))+'</strong><p>PV (planificado): '+fmt(a.pv)+' € · EV (ganado): '+fmt(a.ev)+' € · AC (real): '+fmt(a.ac)+' €</p><p>Desviación de coste: '+fmt(a.cv)+' € · desviación de plazo: '+fmt(a.sv)+' €</p><p>EAC aproximado, si se mantiene el mismo rendimiento: '+(a.eac===null?'—':fmt(a.eac)+' €')+'</p>';
  const max=Math.max(1,a.pv,a.ev,a.ac);viz.innerHTML='<div class="mg-bars">'+[['PV',a.pv],['EV',a.ev],['AC',a.ac]].map(x=>'<div><span>'+x[0]+'</span><i style="width:'+100*x[1]/max+'%"></i><b>'+fmt(x[1],0)+' €</b></div>').join('')+'</div><p class="subtle">Modelo de valor ganado orientativo. No sustituye un presupuesto profesional.</p>';
 };activate(root,draw);draw();
}
function renderRisk(root){
 const {out,viz}=mount(root,'Simula 3.000 escenarios con dos riesgos independientes. Cambia su probabilidad y los días de retraso que provocarían.',''+slider('p1','Probabilidad de fallo técnico',0,100,30,5,'%')+slider('d1','Retraso técnico (días)',0,30,12)+slider('p2','Probabilidad de retraso proveedor',0,100,20,5,'%')+slider('d2','Retraso proveedor (días)',0,30,8));
 const draw=()=>{
  let seed=14571;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
  const values=[];for(let i=0;i<3000;i++){let day=25;if(rnd()<number(root,'p1')/100)day+=number(root,'d1');if(rnd()<number(root,'p2')/100)day+=number(root,'d2');values.push(day)}
  values.sort((a,b)=>a-b);const p50=values[Math.floor(values.length*.5)],p90=values[Math.floor(values.length*.9)],mean=values.reduce((s,x)=>s+x,0)/values.length;
  out.innerHTML='<strong>Plazo medio: '+fmt(mean,1)+' días · P90: '+p90+' días</strong><p>Mediana: '+p50+' días · Fecha base sin riesgos: 25 días.</p><p>Semilla fija para comparar ajustes. Los retrasos simulados pueden coincidir.</p>';
  const freq=new Map;values.forEach(x=>freq.set(x,(freq.get(x)||0)+1));viz.innerHTML='<div class="mg-risk">'+[...freq].map(([days,count])=>'<div><b>'+days+' días</b><i style="width:'+100*count/3000+'%"></i><span>'+fmt(count/30,1)+' %</span></div>').join('')+'</div>'
 };activate(root,draw);draw();
}
function renderBreakEven(root){
 const {out,viz}=mount(root,'Calcula cuántas unidades debe vender una empresa para cubrir sus costes. Prueba diferentes precios y niveles de demanda.',slider('price','Precio de venta (€)',5,200,60,5,' €')+slider('variable','Coste variable (€)',0,180,25,5,' €')+slider('fixed','Costes fijos (€)',1000,50000,14000,1000,' €')+slider('demand','Unidades previstas',0,2000,450,25));
 const draw=()=>{const a=breakEven({price:number(root,'price'),variable:number(root,'variable'),fixed:number(root,'fixed'),demand:number(root,'demand')});
 out.innerHTML='<strong>'+(a.units===null?'No hay punto muerto: el margen unitario es nulo o negativo.':'Punto muerto: '+a.units+' unidades')+'</strong><p>Margen unitario: '+fmt(a.contribution)+' € · Beneficio estimado: '+fmt(a.profit)+' €</p><p>Ingresos: '+fmt(a.revenue)+' € · costes: '+fmt(a.cost)+' €</p>';
 const max=Math.max(1,a.revenue,a.cost);viz.innerHTML='<div class="mg-bars">'+[['Ingresos',a.revenue],['Costes',a.cost]].map(x=>'<div><span>'+x[0]+'</span><i style="width:'+100*x[1]/max+'%"></i><b>'+fmt(x[1],0)+' €</b></div>').join('')+'</div>';
 };activate(root,draw);draw();
}
function renderCash(root){
 const {out,viz}=mount(root,'Proyecta la tesorería mensual de una startup ficticia. Cambia inversión inicial, ingresos, costes y crecimiento.',slider('initial','Caja inicial (€)',0,100000,25000,5000,' €')+slider('income','Ingresos primer mes (€)',0,20000,4000,500,' €')+slider('expense','Gastos mensuales (€)',0,25000,7000,500,' €')+slider('growth','Crecimiento ingresos mensual (%)',-10,25,5,1,'%')+slider('months','Horizonte (meses)',3,24,12));
 const draw=()=>{const rows=cashProjection({initial:number(root,'initial'),revenue:number(root,'income'),expenses:number(root,'expense'),growth:number(root,'growth'),months:number(root,'months')});
  const first=rows.find(r=>r.balance<0),end=rows.at(-1);
  out.innerHTML='<strong>Saldo final: '+fmt(end.balance)+' €</strong><p>'+(first?'La caja pasa a negativo en el mes '+first.month+'.':'No hay saldo negativo durante los '+rows.length+' meses simulados.')+'</p><p>Los ingresos crecen de forma compuesta. No incluye IVA, cobros aplazados ni inflación.</p>';
  viz.innerHTML=table(rows.map(r=>({Mes:r.month,'Ingresos (€)':fmt(r.income),'Gastos (€)':fmt(r.expenses),'Caja (€)':fmt(r.balance)})));
 };activate(root,draw);draw();
}
function renderInvest(root){
 const {out,viz}=mount(root,'Prueba si una inversión genera valor bajo un supuesto de flujos constantes. Calcula VAN descontando flujos futuros.',slider('invest','Desembolso inicial (€)',5000,100000,30000,5000,' €')+slider('cash','Flujo anual (€)',0,40000,10000,1000,' €')+slider('rate','Descuento anual (%)',0,30,10,1,'%')+slider('years','Años',1,12,5));
 const draw=()=>{const a=netPresentValue({investment:number(root,'invest'),cash:number(root,'cash'),rate:number(root,'rate'),years:number(root,'years')});
 out.innerHTML='<strong>VAN: '+fmt(a.npv)+' €</strong><p>'+(a.npv>=0?'VAN no negativo bajo los supuestos elegidos.':'VAN negativo bajo los supuestos elegidos.')+'</p><p>El VAN no contempla riesgos específicos ni garantiza que la inversión vaya a funcionar.</p>';
 viz.innerHTML=table(a.rows.map(x=>({Año:x.year,'Valor actual flujo (€)':fmt(x.discounted)})));
 };activate(root,draw);draw();
}
function renderPrivacy(root){
 const {out,viz}=mount(root,'Eres responsable técnico de una aplicación ficticia. Ajusta los controles de protección de datos y observa qué riesgos merecen una revisión.',slider('records','Datos personales (miles de registros)',1,100,15)+choice('data','Tipo de datos',[['basic','Contactos básicos'],['sensitive','Datos especialmente delicados']])+choice('retention','Plazo de conservación',[['defined','Definido y justificado'],['unknown','Sin plazo definido']])+checks('min','Recoger solo los datos necesarios')+checks('encrypt','Cifrado de datos y control de accesos')+checks('notice','Información clara a las personas'));
 const draw=()=>{
 const issues=[],tips=[];
 if($('#data').value==='sensitive')issues.push('Datos especialmente delicados: requiere evaluación específica.');
 if($('#retention').value==='unknown')issues.push('No has definido cuándo se eliminarán los datos.');
 if(!$('#min').checked)issues.push('Recoges información sin justificar su necesidad.');
 if(!$('#encrypt').checked)issues.push('No están definidos controles técnicos de protección.');
 if(!$('#notice').checked)issues.push('Falta explicar a las personas cómo se usarán sus datos.');
 const k=Math.min(100,issues.length*18+number(root,'records')*.12);
 out.innerHTML='<strong>'+issues.length+' señales para revisar · indicador didáctico '+fmt(k,0)+'/100</strong><p>El indicador NO certifica cumplimiento del RGPD ni determina obligaciones jurídicas.</p>';
 viz.innerHTML=issues.length?'<ul class="mg-notes">'+issues.map(x=>'<li>'+safe(x)+'</li>').join('')+'</ul>':'<p>Has activado las salvaguardas mostradas. Aun así, faltaría revisar base jurídica, derechos, encargados, transferencias y contexto real.</p>';
 };activate(root,draw);root.querySelectorAll('input[type=checkbox]').forEach(el=>el.onchange=draw);draw();
}
function renderLicenses(root){
 const {out,viz}=mount(root,'Comprueba qué cuestiones revisar cuando incorporas software de terceros a un proyecto. Es un simulador de decisiones, no una autorización de uso.',choice('distribution','Tu producto',[['open','Se distribuirá con código fuente'],['closed','Se distribuirá sin publicar el código'],['internal','Uso interno sin redistribución']])+choice('dep','Dependencia elegida',[['mit','Licencia MIT'],['gpl','Licencia GPL-3.0'],['commercial','Licencia comercial de tercero'],['unknown','No sabes qué licencia tiene']])+checks('modify','Modificaré el código de la dependencia'));
 const draw=()=>{
 const dist=$('#distribution').value,dep=$('#dep').value,modified=$('#modify').checked,notes=[];
 if(dep==='mit')notes.push('MIT: revisa atribución, aviso de copyright y conservación de licencia en distribuciones.');
 if(dep==='gpl')notes.push('GPL-3.0: revisa las obligaciones al distribuir una obra derivada o una combinación alcanzada por sus condiciones.');
 if(dep==='commercial')notes.push('Licencia comercial: el alcance depende del contrato específico, límites y sublicencia.');
 if(dep==='unknown')notes.push('Sin licencia identificada: no presupongas que puedes copiar, modificar o redistribuir el software.');
 if(dist==='closed'&&dep==='gpl')notes.push('Distribución cerrada + código GPL: requiere analizar compatibilidad y alcance del copyleft antes de publicar.');
 if(dist==='internal')notes.push('El uso interno puede tener condiciones distintas de la distribución, pero hay que comprobar la licencia.');
 if(modified)notes.push('Has modificado una dependencia: documenta cambios y revisa sus obligaciones específicas.');
 out.innerHTML='<strong>'+notes.length+' consideraciones detectadas</strong><p>Revisión orientativa basada en tipos de licencias, sin emitir una conclusión legal definitiva.</p>';
 viz.innerHTML='<ul class="mg-notes">'+notes.map(x=>'<li>'+safe(x)+'</li>').join('')+'</ul>';
 };activate(root,draw);root.querySelector('#modify').onchange=draw;draw();
}
function renderIncident(root){
 const {out,viz}=mount(root,'Gestiona una brecha ficticia: decide qué tareas realizar y observa el registro de respuesta. El tiempo es simulado y no se envía ningún aviso real.',slider('hours','Horas desde la detección',0,120,5)+choice('risk','Riesgo para las personas',[['low','Bajo según evaluación inicial'],['high','Potencialmente alto']])+checks('contain','He contenido el acceso no autorizado')+checks('evidence','He preservado evidencias y registro')+checks('assess','He evaluado datos afectados y consecuencias')+checks('consult','He consultado al equipo jurídico/DPD')+checks('document','He documentado la decisión de notificar o no'));
 const draw=()=>{
 const completed=['contain','evidence','assess','consult','document'].filter(x=>$('#'+x).checked),hours=number(root,'hours'),high=$('#risk').value==='high',notes=[];
 if(!$('#contain').checked)notes.push('Prioridad técnica: contener el incidente y evitar más exposición.');
 if(!$('#evidence').checked)notes.push('Preserva evidencias y la cronología de los hechos.');
 if(!$('#assess').checked)notes.push('Valora el posible riesgo para derechos y libertades de las personas.');
 if(high)notes.push('Riesgo potencialmente alto: revisar con urgencia las obligaciones de comunicación a las personas afectadas.');
 if(hours>=72)notes.push('Han pasado al menos 72 horas en el escenario. Revisa los plazos y excepciones aplicables si corresponde notificar a la autoridad.');
 out.innerHTML='<strong>'+completed.length+'/5 tareas completadas · '+hours+' h simuladas</strong><p>Una brecha de datos personales puede requerir documentación y, según el riesgo, notificación a la autoridad de control y/o afectados. La aplicación no decide esas obligaciones por ti.</p>';
 viz.innerHTML='<ul class="mg-notes">'+(notes.length?notes.map(x=>'<li>'+safe(x)+'</li>').join(''):'<li>Has completado la lista operativa. Sigue siendo necesaria una revisión real de circunstancias y obligaciones.</li>')+'</ul>';
 };activate(root,draw);root.querySelectorAll('input[type=checkbox]').forEach(el=>el.onchange=draw);draw();
}
function renderChannels(root){
 const {out,viz}=mount(root,'Diseña una comunicación de equipo. Cambia urgencia, complejidad, confidencialidad y destinatarios; compara canales posibles.',slider('urgent','Urgencia',0,10,6)+slider('complex','Complejidad',0,10,7)+slider('secret','Confidencialidad',0,10,5)+slider('people','Destinatarios',1,50,12));
 const draw=()=>{const ranked=scoreChannels({urgency:number(root,'urgent'),complexity:number(root,'complex'),sensitivity:number(root,'secret'),people:number(root,'people')});
 out.innerHTML='<strong>Canal sugerido: '+safe(ranked[0].name)+'</strong><p>'+safe(ranked[0].reason)+'</p><p>Heurística de comunicación: ajusta el contexto; no existe un canal universalmente correcto.</p>';
 const min=Math.min(...ranked.map(x=>x.score)),max=Math.max(...ranked.map(x=>x.score));
 viz.innerHTML='<div class="mg-bars">'+ranked.map(x=>'<div><span>'+safe(x.name)+'</span><i style="width:'+Math.max(3,100*(x.score-min+10)/(max-min+10))+'%"></i><b>'+fmt(x.score,0)+'</b></div>').join('')+'</div>';
 };activate(root,draw);draw();
}
function renderTeam(root){
 const {out,viz}=mount(root,'Experimenta con factores organizativos de un equipo ficticio: objetivos claros, confianza, carga y autonomía.',slider('clarity','Claridad de objetivos',0,10,6)+slider('trust','Confianza',0,10,5)+slider('load','Sobrecarga',0,10,7)+slider('autonomy','Autonomía',0,10,4));
 const draw=()=>{const clarity=number(root,'clarity'),trust=number(root,'trust'),load=number(root,'load'),autonomy=number(root,'autonomy'),health=Math.max(0,Math.min(100,25+2*clarity+3*trust+2*autonomy-3*load));
 out.innerHTML='<strong>Índice de coordinación ficticio: '+fmt(health,0)+'/100</strong><p>'+(load>7?'Carga muy alta: revisa prioridades y recursos. ':'' )+(trust<5?'Confianza baja: escucha y transparencia pueden ayudar. ':'')+(clarity<5?'Faltan objetivos claros. ':'')+'</p><p>El índice es inventado para experimentar. No mide el bienestar ni el rendimiento real de ninguna persona.</p>';
 viz.innerHTML='<div class="mg-bars"><div><span>Coordinación</span><i style="width:'+health+'%"></i><b>'+fmt(health,0)+'/100</b></div></div>';
 };activate(root,draw);draw();
}
function renderMeeting(root){
 const {out,viz}=mount(root,'Reparte el tiempo de una reunión de proyecto y comprueba cuánto queda para decisiones y seguimiento.',slider('duration','Duración total (min)',15,120,60,5)+slider('context','Exposición de contexto (min)',0,90,20,5)+slider('discussion','Discusión (min)',0,90,25,5)+slider('decisions','Decisiones (min)',0,60,10,5)+slider('followup','Próximos pasos (min)',0,60,5,5));
 const draw=()=>{const total=number(root,'duration'),parts=['context','discussion','decisions','followup'].map(k=>number(root,k)),sum=parts.reduce((a,b)=>a+b,0),difference=total-sum;
 out.innerHTML='<strong>'+(difference>=0?'Quedan '+difference+' minutos sin asignar':'Te has pasado '+Math.abs(difference)+' minutos')+'</strong><p>Tiempo para acuerdos y seguimiento: '+fmt((parts[2]+parts[3])/Math.max(1,total)*100,0)+' % del total.</p><p>Un reparto no garantiza eficacia: objetivos, participantes y acta importan tanto como los minutos.</p>';
 viz.innerHTML='<div class="mg-bars">'+[['Contexto',parts[0]],['Debate',parts[1]],['Decisiones',parts[2]],['Seguimiento',parts[3]]].map(x=>'<div><span>'+x[0]+'</span><i style="width:'+100*x[1]/Math.max(total,sum,1)+'%"></i><b>'+x[1]+' min</b></div>').join('')+'</div>';
 };activate(root,draw);draw();
}
const RENDERS={gantt:renderGantt,earned:renderEarned,risk:renderRisk,breakeven:renderBreakEven,cashflow:renderCash,investment:renderInvest,privacy:renderPrivacy,licenses:renderLicenses,incident:renderIncident,channels:renderChannels,team:renderTeam,meeting:renderMeeting};
export const MANAGEMENT_TYPES=new Set(Object.keys(RENDERS));
export function renderManagement(root,lab){const render=RENDERS[lab.type];if(!render)throw Error('Laboratorio no reconocido: '+lab.type);render(root)}
