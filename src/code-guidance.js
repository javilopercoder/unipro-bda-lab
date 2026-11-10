// Pistas de sintaxis escalonadas. Ninguna escribe en el editor sin pulsar "Insertar".
const htmlEscape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char]));
export function progressiveFragments(example){
 const code=String(example||'').trim();
 if(!code)return[''];
 // Los fragmentos se cortan respetando las palabras y los saltos de línea.
 const tokens=code.match(/\S+\s*/g)||[code];
 const chunk=count=>tokens.slice(0,Math.max(1,Math.min(tokens.length,count))).join('').trimEnd();
 const early=chunk(Math.ceil(tokens.length*.3));
 const mid=chunk(Math.ceil(tokens.length*.65));
 return [...new Set([early,mid,code])];
}
export function attachCodeHints({container,editor,example,concept='',label='consulta',onInsert}){
 let level=0;
 const fragments=progressiveFragments(example);
 const box=document.createElement('div');
 box.className='code-help';
 box.innerHTML='<div class="code-help-head"><span>PISTAS POR FRAGMENTOS</span><span class="code-help-counter">0 / 4</span></div>'+
 '<div class="code-help-actions"><button type="button" class="code-help-next">💡 Dame una pista</button><button type="button" class="code-help-insert" hidden>Insertar fragmento en el editor</button></div>'+
 '<div class="code-help-content" aria-live="polite">Empieza escribiendo desde cero. Puedes ejecutar cualquier '+htmlEscape(label)+' admitida por este entorno; las pistas no bloquean otras soluciones.</div>';
 container.append(box);
 const next=box.querySelector('.code-help-next'),insert=box.querySelector('.code-help-insert'),display=box.querySelector('.code-help-content');
 const stages=[
  {text:concept||'Identifica qué datos necesitas y con qué comando empezar.',snippet:''},
  ...fragments.map((snippet,i)=>({text:i===fragments.length-1?'Ejemplo completo, por si necesitas comprobar la estructura.':'Una parte del comando. Completa lo demás por tu cuenta.',snippet}))
 ];
 const render=()=>{
  box.querySelector('.code-help-counter').textContent=level+' / '+stages.length;
  next.textContent=level>=stages.length?'✓ Todas las pistas vistas':'💡 Pista '+(level+1)+' de '+stages.length;
  next.disabled=level>=stages.length;
  const stage=stages[Math.max(0,level-1)];
  if(!stage){display.textContent='Empieza con una entrada vacía. Las pistas van mostrando primero la idea, después la sintaxis.';insert.hidden=true;return}
  display.innerHTML='<p>'+htmlEscape(stage.text)+'</p>'+(stage.snippet?'<pre class="code-help-snippet"><code>'+htmlEscape(stage.snippet)+'</code></pre>':'');
  insert.hidden=!stage.snippet;
  insert.textContent=level>=stages.length?'Usar este ejemplo (opcional)':'Insertar esta parte (opcional)';
 };
 next.onclick=()=>{level=Math.min(level+1,stages.length);render()};
 insert.onclick=()=>{
  const stage=stages[level-1];if(!stage?.snippet)return;
  // No se sobrescribe trabajo previo. El alumno puede elegir conservarlo o editarlo.
  const current=editor.value;
  if(current.trim()&&stage.snippet.startsWith(current.trimEnd()))editor.value=stage.snippet;
  else if(current.trim()&&editor.selectionStart!==editor.selectionEnd){editor.setRangeText(stage.snippet,editor.selectionStart,editor.selectionEnd,'end')}
  else if(current.trim()){display.insertAdjacentHTML('beforeend','<p class="code-help-note">Para conservar tu solución, no hemos sobrescrito el editor. Selecciona la parte que quieras reemplazar y pulsa «Insertar» de nuevo.</p>');return}
  else editor.value=stage.snippet;
  editor.dispatchEvent(new Event('input',{bubbles:true}));
  editor.focus();editor.setSelectionRange(editor.value.length,editor.value.length);
  onInsert?.(editor.value);
 };
 render();
 return {reset(){level=0;render()},element:box};
}
