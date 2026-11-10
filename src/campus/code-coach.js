// Guías de sintaxis para editores reales. No ejecuta comandos ni revela ejemplos sin petición.
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
export function fragmentOf(example,language,level=1){
 const source=String(example||'').trim();
 if(level>=3)return source;
 if(language==='sql'){
   const lines=source.split('\n').map(x=>x.trim()).filter(Boolean);
   if(lines.length>=2)return lines.slice(0,level===1?1:Math.min(lines.length-1,2)).join('\n');
   const where=source.search(/\bWHERE\b|\bFROM\b|\bJOIN\b/i);
   if(where>0)return source.slice(0,level===1?where:Math.min(source.length,where+Math.ceil((source.length-where)*.55))).trim();
   return source.slice(0,Math.ceil(source.length*(level===1?.35:.65))).trim();
 }
 if(language==='mongo'){
   const opening=source.indexOf('(');
   if(opening<0)return source.slice(0,level===1?12:Math.ceil(source.length*.65));
   if(level===1)return source.slice(0,opening+1);
   return source.slice(0,Math.min(source.length-1,opening+1+Math.max(6,Math.ceil((source.length-opening)*.5))));
 }
 if(language==='xpath'){
   if(level===1)return source.startsWith('//')?'//':'/';
   const split=source.indexOf('/',2);
   return split>0?source.slice(0,split):source.slice(0,Math.max(3,Math.ceil(source.length*.6)));
 }
 return source.slice(0,Math.max(2,Math.ceil(source.length*(level===1?.4:.7))));
}
function introText(language){
 return {sql:'SQL consulta tablas. Empieza por qué quieres obtener y después añade de dónde vienen los datos.',mongo:'MongoDB usa expresiones con documentos JSON. Aquí se interpreta un subconjunto de find y aggregate.',xpath:'XPath selecciona elementos y atributos de un documento XML mediante rutas.'}[language]||'Construye el comando por partes. Puedes escribir cualquier solución compatible con el motor.';
}
export function createCodeCoach({host,editor,language}){
 let task=null,level=0,previousFragment='';
 host.innerHTML='<div class="code-coach"><div class="code-coach-heading"><b>Una pista, cuando la necesites</b><span>Ayuda gradual</span></div>'+
  '<p class="code-coach-intro">'+escapeHTML(introText(language))+'</p>'+
  '<button type="button" id="coach-next" class="coach-hint-button">💡 Mostrar la primera pista</button>'+
  '<div id="coach-stages" class="coach-stages" aria-live="polite"></div>'+
  '<button type="button" id="coach-insert" class="coach-insert" hidden>Insertar el fragmento en el editor</button>'+
  '<p class="coach-preserve">Puedes escribir cualquier consulta válida. Las pistas no ejecutan nada ni sustituyen tu código automáticamente.</p></div>';
 const next=host.querySelector('#coach-next'),stages=host.querySelector('#coach-stages'),insert=host.querySelector('#coach-insert');
 const setTask=nextTask=>{
  task=nextTask;level=0;previousFragment='';stages.replaceChildren();insert.hidden=true;next.disabled=false;next.textContent='💡 Mostrar la primera pista';
 };
 const addHint=()=>{
   if(!task||level>=3)return;
   level++;
   const example=task.starter||task.xpath||'',message=level===1?(task.hint||'Empieza por identificar la operación principal.'):level===2?'Esta es la estructura inicial. Completa las condiciones por tu cuenta.':'Aquí tienes un ejemplo completo para comparar con tu intento.';
   const block=document.createElement('div');block.className='coach-step';
   const header=document.createElement('strong');header.textContent='Pista '+level+'/3';
   const description=document.createElement('p');description.textContent=message;block.append(header,description);
   if(level>1&&example){
     const code=document.createElement('code');code.className='coach-fragment';code.textContent=fragmentOf(example,language,level===2?1:3);
     block.append(code);
     previousFragment=code.textContent;insert.hidden=false;
   }
   stages.append(block);
   if(level===3){next.disabled=true;next.textContent='✓ Ya tienes las tres pistas'}
   else next.textContent='💡 Siguiente pista ('+(level+1)+'/3)';
 };
 next.onclick=addHint;
 insert.onclick=()=>{
   if(!previousFragment)return;
   const newText=previousFragment;
   if(!editor.value.trim())editor.value=newText;
   else {
      const start=editor.selectionStart,end=editor.selectionEnd;
      editor.setRangeText(newText,start,end,'end');
   }
   editor.focus();editor.dispatchEvent(new Event('input',{bubbles:true}));
 };
 return{setTask,showHint:addHint};
}
// Consola Redis independiente: las pistas también se construyen por fragmentos.
export const REDIS_MISSIONS=[
 {label:'Exploración libre',goal:'Escribe comandos Redis compatibles y observa qué cambian.',starter:'HELP',hint:'Usa HELP para descubrir los comandos implementados.'},
 {label:'Guardar una clave',goal:'Guarda un nombre en la clave alumno y después recupera su valor.',starter:'SET alumno Ana',hint:'Para crear valores se utiliza SET clave valor.'},
 {label:'Leer una clave',goal:'Consulta el contenido de alumno con GET.',starter:'GET alumno',hint:'GET devuelve el valor asociado a una clave.'},
 {label:'Crear un contador',goal:'Incrementa un contador ficticio y comprueba cómo cambia.',starter:'INCR visitas',hint:'INCR suma uno a un valor entero. Una clave nueva puede empezar en cero.'},
 {label:'Caducidad de datos',goal:'Experimenta con una expiración y consulta cuántos segundos quedan.',starter:'EXPIRE alumno 60',hint:'EXPIRE recibe la clave y el tiempo en segundos.'}
];
