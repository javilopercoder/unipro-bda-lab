// Pequeño intérprete explícito de pseudocódigo: no usa eval ni ejecuta código arbitrario.
export function evaluateArithmetic(expression,vars={}){
 const input=String(expression||'').trim(),tokens=input.match(/[A-Za-z_]\w*|\d+(?:\.\d+)?|[()+\-*/]/g)||[];
 if(tokens.join('')!==input.replace(/\s+/g,''))throw Error('Hay símbolos no admitidos en la expresión: '+input);
 let i=0;
 const atom=()=>{
  const t=tokens[i++];
  if(t==='('){const result=expressionValue();if(tokens[i++]!==')')throw Error('Falta cerrar un paréntesis.');return result}
  if(t==='-')return-atom();
  if(/^\d+(?:\.\d+)?$/.test(t||''))return Number(t);
  if(/^[A-Za-z_]\w*$/.test(t||'')){
   if(!Object.hasOwn(vars,t))throw Error('Variable no definida: '+t);
   return vars[t];
  }
  throw Error('Expresión incompleta.');
 };
 const term=()=>{let v=atom();while(tokens[i]==='*'||tokens[i]==='/'){const op=tokens[i++],b=atom();if(op==='/'&&b===0)throw Error('No puedes dividir entre cero.');v=op==='*'?v*b:v/b}return v};
 const expressionValue=()=>{let v=term();while(tokens[i]==='+'||tokens[i]==='-'){const op=tokens[i++],b=term();v=op==='+'?v+b:v-b}return v};
 const result=expressionValue();
 if(i!==tokens.length)throw Error('Comprueba el orden de las operaciones.');
 if(!Number.isFinite(result)||Math.abs(result)>1e12)throw Error('Resultado demasiado grande.');
 return result;
}
export function runPseudocode(source,N=6){
 const lines=String(source||'').replace(/\r/g,'').split('\n').map((raw,index)=>({index:index+1,raw,code:raw.trim(),indent:/^\s*/.exec(raw)[0].length})).filter(x=>x.code&&!x.code.startsWith('#'));
 if(!lines.length)throw Error('El editor está vacío. Construye un programa o utiliza las pistas.');
 if(lines.length>30||source.length>2000)throw Error('Este intérprete admite hasta 30 líneas y 2.000 caracteres.');
 const variables={N:Number(N)},trace=[],output=[];
 const assignment=(line)=>{
   const match=/^([A-Za-z_]\w*)\s*=\s*(.+)$/.exec(line.code);
   if(!match)throw Error('Línea '+line.index+': utiliza nombre = expresión.');
   if(match[1]==='N')throw Error('N se modifica con el control superior.');
   variables[match[1]]=evaluateArithmetic(match[2],variables);
 };
 let cursor=0,iterations=0;
 const snapshot=(line,label)=>trace.push({step:trace.length,line:line.index,label,variables:{...variables}});
 const loop=/^for\s+([A-Za-z_]\w*)\s+in\s+range\((.+),\s*(.+)\)\s*:$/.exec(lines.find(x=>x.code.startsWith('for '))?.code||'');
 for(const line of lines){
  if(line.code.startsWith('import ')||line.code.startsWith('exec('))throw Error('Solo se admiten asignaciones, for/range y print.');
 }
 while(cursor<lines.length){
   const line=lines[cursor];
   if(line.indent>0)throw Error('Línea '+line.index+': la sangría debe estar dentro de un for.');
   const loopHeader=/^for\s+([A-Za-z_]\w*)\s+in\s+range\(\s*(.+?)\s*,\s*(.+?)\s*\):$/.exec(line.code);
   if(loopHeader){
     const name=loopHeader[1],from=evaluateArithmetic(loopHeader[2],variables),until=evaluateArithmetic(loopHeader[3],variables);
     if(!Number.isInteger(from)||!Number.isInteger(until)||until-from>150||from< -150||until>150)throw Error('El rango debe usar enteros y como máximo 150 iteraciones.');
     cursor++;
     const body=[];while(cursor<lines.length&&lines[cursor].indent>0){body.push(lines[cursor++])}
     if(!body.length)throw Error('Después del for tienes que escribir una instrucción indentada.');
     for(let v=from;v<until;v++){
       variables[name]=v;for(const statement of body)assignment(statement);
       iterations++;snapshot(line,'Iteración '+iterations);
       if(trace.length>200)throw Error('Demasiados pasos para este laboratorio.');
     }
     continue;
   }
   const print=/^print\((.+)\)$/.exec(line.code);
   if(print){const value=evaluateArithmetic(print[1],variables);output.push(value);snapshot(line,'Salida: '+value);cursor++;continue}
   assignment(line);snapshot(line,'Asignación');cursor++;
 }
 return{variables,trace,output,iterations};
}
const fragments=[
 'suma = 0',
 'suma = 0\nfor i in range(1, N + 1):',
 'suma = 0\nfor i in range(1, N + 1):\n    suma = suma + i\nprint(suma)'
];
export function renderFlowEditor(root){
 root.innerHTML='<div class="flow-ide">'+
  '<p class="lab-intro">Programa una suma acumulada y observa cómo cambian las variables. Este intérprete admite asignaciones, operaciones aritméticas, <code>for/range</code> y <code>print</code>. Es pseudocódigo de práctica, no Python completo.</p>'+
  '<div class="controls"><label class="control"><span>Hasta qué número quieres sumar (N)</span><input type="range" id="max" min="2" max="20" value="6" step="1"></label></div>'+
  '<div class="flow-editor-frame"><div class="flow-editor-heading"><span>✦ editor · pseudocódigo</span><small>Escribe desde cero</small></div>'+
  '<textarea id="flow-code" spellcheck="false" autocapitalize="off" aria-label="Editor de pseudocódigo" placeholder="Escribe tu primera línea aquí…"></textarea>'+
  '<div class="flow-editor-actions"><button type="button" id="next" class="btn">Ejecutar siguiente paso</button><button type="button" id="flow-run" class="btn">▶ Ejecutar todo</button><button type="button" id="reset" class="btn">↻ Reiniciar recorrido</button></div></div>'+
  '<div class="flow-hint-box"><button type="button" id="flow-hint">💡 Pista 1 de 3</button><button type="button" id="flow-insert" hidden>Usar este fragmento</button><div id="flow-hint-result" aria-live="polite"></div></div>'+
  '<div class="output-card" id="lab-output" aria-live="polite"><strong>Tu programa está en blanco.</strong><p>Empieza con una variable: <code>suma = 0</code>. Después puedes seguir construyéndolo.</p></div>'+
  '<div class="visual-card" id="lab-viz"><p>Cuando ejecutes, verás cada paso y el valor de las variables.</p></div></div>';
 const $=id=>root.querySelector('#'+id),editor=$('flow-code');
 let executed=null,position=0,hintIndex=0,oldHint='';
 const display=()=>{
   if(!executed){$('lab-output').innerHTML='<strong>Programa sin ejecutar</strong><p>Escribe instrucciones y pulsa ejecutar. Si no sabes cómo empezar, abre la primera pista.</p>';$('lab-viz').textContent='Todavía no hay instrucciones ejecutadas.';return}
   const steps=executed.trace,selected=steps[Math.min(position,steps.length-1)],vars=selected?.variables||{N:Number($('max').value)};
   const rows=Object.entries(vars).map(([key,value])=>'<div class="flow-var"><span>'+key+'</span><b>'+value+'</b></div>').join('');
   const doneSteps=steps.slice(0,position+1),iterationsDone=doneSteps.filter(x=>x.label.startsWith('Iteración ')).length,printed=selected?.label?.startsWith('Salida:');
   $('lab-output').innerHTML='<strong>'+(!steps.length?'Sin pasos':'Paso '+Math.min(position+1,steps.length)+' de '+steps.length)+'</strong><p>'+ (selected?.label||'Programa terminado') +' · iteraciones: '+iterationsDone+'</p><p>'+(printed&&executed.output.length?'Salida: '+executed.output.join(' · '):'Observa cómo cambian las variables en cada paso.')+'</p>';
   $('lab-viz').innerHTML='<div class="flow-variable-grid">'+rows+'</div><p class="subtle">La traza muestra el estado de las variables tras cada instrucción.</p>';
 };
 const evaluate=()=>{try{executed=runPseudocode(editor.value,Number($('max').value));position=0;editor.dataset.changed='false';display();return true}catch(e){executed=null;$('lab-output').innerHTML='<strong>Revisa el código</strong><p>'+e.message.replace(/[<>&]/g,'')+'</p>';$('lab-viz').textContent='El código no se ha ejecutado.';return false}};
 $('next').onclick=()=>{
   if(!executed||$('flow-code').dataset.changed==='true'){if(!evaluate())return}
   else position=Math.min(position+1,Math.max(0,executed.trace.length-1));
   display();
 };
 $('flow-run').onclick=()=>{if(evaluate()){position=Math.max(0,executed.trace.length-1);display()}};
 $('reset').onclick=()=>{executed=null;position=0;display()};
 editor.oninput=()=>{editor.dataset.changed='true';executed=null};
 $('max').oninput=()=>{executed=null;display()};
 const paste=$('flow-insert');
 $('flow-hint').onclick=()=>{
   if(hintIndex>=fragments.length)return;
   const messages=['Primero necesitas una variable que empiece en cero.','Después, repite la operación para cada valor de i.','Dentro del bucle acumula el número actual y al final muestra el resultado.'];
   const p=document.createElement('p');p.textContent='Pista '+(hintIndex+1)+': '+messages[hintIndex];
   const pre=document.createElement('code');pre.textContent=fragments[hintIndex];p.append(pre);$('flow-hint-result').append(p);
   oldHint=fragments[hintIndex];hintIndex++;paste.hidden=false;
   $('flow-hint').textContent=hintIndex===3?'✓ Todas las pistas': '💡 Pista '+(hintIndex+1)+' de 3';$('flow-hint').disabled=hintIndex===3;
 };
 paste.onclick=()=>{if(!editor.value.trim()||fragments.includes(editor.value.trim()))editor.value=oldHint;else editor.setRangeText(oldHint,editor.selectionStart,editor.selectionEnd,'end');editor.dataset.changed='true';executed=null;editor.focus()};
 display();
}
