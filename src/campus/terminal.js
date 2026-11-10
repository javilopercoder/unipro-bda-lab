// Terminal libre, simulada y local. Nunca ejecuta comandos del equipo.
const DEFAULT_TREE=()=>({type:'dir',children:{home:{type:'dir',children:{alumno:{type:'dir',children:{'leeme.txt':{type:'file',data:'Bienvenido al laboratorio. Prueba help para ver los comandos disponibles.'}}}}}}});
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const COMMANDS=['help','pwd','ls','cd','mkdir','touch','cat','write','echo','cp','mv','rm','tree','clear','whoami','history'];
export function tokenize(input){
 const results=[],rx=/"([^"]*)"|'([^']*)'|(\S+)/g;let match;
 while((match=rx.exec(input)))results.push(match[1]??match[2]??match[3]);
 return results;
}
export function createTerminalMachine(){
 let tree=DEFAULT_TREE(),cwd=['home','alumno'],history=[];
 const pathOf=p=>{const route=String(p||'.').startsWith('/')?[]:[...cwd];for(const segment of String(p||'.').split('/')){if(!segment||segment==='.')continue;if(segment==='..')route.pop();else route.push(segment)}return route};
 const lookup=parts=>parts.reduce((node,key)=>node?.type==='dir'?node.children[key]:undefined,tree);
 const parentOf=p=>{const path=pathOf(p);return{parent:lookup(path.slice(0,-1)),name:path.at(-1)}};
 const pathString=()=>'/'+cwd.join('/');
 const commands=()=>[...COMMANDS];
 const treeView=(node,depth=0)=>Object.entries(node.children||{}).map(([name,item])=>'  '.repeat(depth)+name+(item.type==='dir'?'/\n'+treeView(item,depth+1):'')).join('\n');
 const reset=()=>{tree=DEFAULT_TREE();cwd=['home','alumno'];history=[]};
 const execute=raw=>{
   const line=String(raw||'').trim();if(!line)return{output:'',path:pathString(),clear:false};
   history.push(line);if(history.length>100)history.shift();
   const parts=tokenize(line),[op,...args]=parts,path=args[0]||'.',node=lookup(pathOf(path));
   let output='',clear=false;
   switch(op){
     case 'help':output='Comandos: '+COMMANDS.join(', ')+'\nEjemplo: mkdir proyectos\nDespués: touch proyectos/notas.txt\nLa terminal es una simulación y los archivos viven solo en esta sesión.';break;
     case 'whoami':output='alumno';break;
     case 'history':output=history.map((cmd,i)=>(i+1)+'  '+cmd).join('\n');break;
     case 'pwd':output=pathString();break;
     case 'ls':output=node?.type==='dir'?Object.entries(node.children).map(([name,x])=>name+(x.type==='dir'?'/':'')).join('   ')||'(directorio vacío)':node?.type==='file'?path:'No existe esa ruta';break;
     case 'cd':if(node?.type!=='dir')output='No existe ese directorio. Prueba ls para ver las rutas disponibles.';else{cwd=pathOf(path);output=pathString()}break;
     case 'mkdir':case 'touch':{
       if(!args[0]){output='Uso: '+op+' nombre';break}
       const {parent,name}=parentOf(path);
       if(parent?.type!=='dir'||!name)output='Ruta inválida: revisa el directorio padre.';
       else if(parent.children[name])output='Ya existe: '+name;
       else{parent.children[name]=op==='mkdir'?{type:'dir',children:{}}:{type:'file',data:''};output='Creado: '+name}
       break;
     }
     case 'cat':output=node?.type==='file'?node.data:'No se encontró un archivo con ese nombre.';break;
     case 'write':{
       if(args.length<2){output='Uso: write notas.txt tu texto';break}
       if(node?.type!=='file'){output='Primero crea el archivo con touch o indica uno existente.';break}
       node.data=args.slice(1).join(' ').slice(0,10000);
       output='Escritos '+node.data.length+' caracteres en '+path;break;
     }
     case 'echo':{
       const redirect=args.indexOf('>'),text=redirect===-1?args.join(' '):args.slice(0,redirect).join(' ');
       if(redirect===-1){output=text;break}
       const dest=args[redirect+1];if(!dest){output='Uso: echo texto > archivo.txt';break}
       const {parent,name}=parentOf(dest);
       if(parent?.type!=='dir'||!name){output='Ruta inválida';break}
       parent.children[name]={type:'file',data:text.slice(0,10000)};
       output='Guardado en '+dest;break;
     }
     case 'cp':case 'mv':{
       if(args.length<2){output='Uso: '+op+' origen destino';break}
       if(node?.type!=='file'){output='Solo se pueden copiar o mover archivos existentes.';break}
       const {parent,name}=parentOf(args[1]);if(parent?.type!=='dir'||!name){output='Destino inválido';break}
       parent.children[name]={type:'file',data:node.data};
       if(op==='mv'){const old=parentOf(path);if(old.parent)delete old.parent.children[old.name]}
       output='Operación completada: '+args[1];break;
     }
     case 'rm':{
       const {parent,name}=parentOf(path);
       if(node?.type!=='file'||!parent){output='rm solo elimina archivos. Para revisar una ruta escribe ls.';break}
       delete parent.children[name];output='Eliminado: '+path;break;
     }
     case 'tree':output=treeView(node?.type==='dir'?node:tree)||'(vacío)';break;
     case 'clear':clear=true;break;
     default:output='Comando no reconocido: '+op+'. Escribe help para ver las opciones.';break;
   }
   return{output,path:pathString(),clear};
 };
 return{execute,reset,getPath:pathString,getHistory:()=>[...history],getTree:()=>tree,commands};
}
const MISSIONS=[
 {name:'Exploración libre',goal:'Prueba cualquier comando. No hay pasos obligatorios ni límites de intentos.',hints:[['Prueba a descubrir dónde estás. El comando pwd muestra la ruta actual.','pwd'],['Mira qué hay en la carpeta. ls lista su contenido.','ls'],['Con help podrás consultar todos los comandos disponibles.','help']]},
 {name:'Crear un directorio',goal:'Crea una carpeta llamada proyectos y comprueba que aparece en el listado.',hints:[['Para crear carpetas se usa mkdir.','mkdir'],['Después del comando va el nombre de la carpeta.','mkdir proyectos'],['Para verificarlo, lista el contenido.','ls']]},
 {name:'Crear y escribir un archivo',goal:'Crea notas.txt, escribe una frase y léela desde la consola.',hints:[['Necesitas touch para crear el archivo.','touch'],['Pon el nombre al final y ejecútalo.','touch notas.txt'],['Después usa write notas.txt texto y cat notas.txt para leerlo.','write notas.txt Hola laboratorio']]},
 {name:'Mover y copiar archivos',goal:'Copia un archivo existente y muévelo a otro nombre.',hints:[['cp copia y mv mueve archivos. Empieza consultando ls.','ls'],['Prueba a copiar el archivo inicial.','cp leeme.txt'],['Completa los dos nombres: origen y destino.','cp leeme.txt copia.txt']]},
 {name:'Navegar por carpetas',goal:'Comprueba la ruta actual, entra en otro directorio y vuelve.',hints:[['pwd te indica la ubicación y cd permite moverte.','pwd'],['Para ir a la carpeta superior se utiliza ..','cd ..'],['Para volver a la carpeta inicial usa su nombre.','cd alumno']]}
];
export function renderTerminal(root){
 const engine=createTerminalMachine();
 root.innerHTML='<div class="terminal-lab">'+
  '<div class="terminal-heading"><div><b>Terminal interactiva</b><p>Escribe directamente en la consola. Puedes explorar sin seguir un ejercicio.</p></div><span class="terminal-local-pill">● Sistema ficticio</span></div>'+
  '<section class="terminal-frame" aria-label="Terminal interactiva">'+
  '<div class="terminal-titlebar"><div class="terminal-window-dots"><i></i><i></i><i></i></div><span>alumno@lab · entorno local</span><button type="button" id="clear" class="terminal-reset">↺ Reiniciar entorno</button></div>'+
  '<div class="terminal-screen" id="lab-viz"><div id="terminal-output" class="terminal-log" role="log" aria-live="polite" aria-label="Historial de la terminal"></div>'+
  '<div class="terminal-input-line"><label id="terminal-prompt" for="command">alumno@lab:/home/alumno$</label><input id="command" type="text" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="Escribe un comando en la terminal" placeholder="Escribe aquí…"/><button type="button" id="run" aria-label="Ejecutar comando">↵</button></div></div>'+
  '<div class="terminal-statusbar"><span>Enter: ejecutar</span><span>↑ ↓: historial</span><span>Tab: completar comandos</span></div></section>'+
  '<div class="terminal-coach"><div class="terminal-coach-top"><label for="term-mission">Practica a tu manera</label><select id="term-mission">'+MISSIONS.map((m,i)=>'<option value="'+i+'">'+escapeHTML(m.name)+'</option>').join('')+'</select></div>'+
  '<p id="term-goal" class="terminal-goal"></p><div class="terminal-coach-controls"><button type="button" id="term-hint">💡 Pista 1 de 3</button><button type="button" id="term-paste" hidden>Escribir fragmento en la terminal</button></div><div id="term-hint-result" class="terminal-hint-result" aria-live="polite"></div></div>'+
  '<div class="terminal-result" id="lab-output" aria-live="polite">La terminal está lista. Puedes empezar con <code>help</code> o escribir tu primer comando.</div></div>';
 const $=sel=>root.querySelector(sel);
 const terminal=$('#terminal-output'),input=$('#command'),prompt=$('#terminal-prompt'),result=$('#lab-output'),hintButton=$('#term-hint'),hintResult=$('#term-hint-result'),paste=$('#term-paste');
 let historyIndex=0,hintIndex=0,suggestion='';
 const scroll=()=>{const screen=$('#lab-viz');screen.scrollTop=screen.scrollHeight};
 const writeLog=(line,output)=>{
   const block=document.createElement('div');block.className='terminal-entry';
   const command=document.createElement('div');command.className='terminal-typed';command.textContent=engine.getPath()+' $ '+line;
   block.append(command);
   if(output){const message=document.createElement('pre');message.className='terminal-response';message.textContent=output;block.append(message)}
   terminal.append(block);
   while(terminal.children.length>120)terminal.firstChild.remove();
   scroll();
 };
 const run=()=>{
   const line=input.value.trim();if(!line){input.focus();return}
   const before=engine.getPath(),r=engine.execute(line);
   if(r.clear)terminal.replaceChildren();
   else{const block=document.createElement('div');block.className='terminal-entry';const command=document.createElement('div');command.className='terminal-typed';command.textContent='alumno@lab:'+before+'$ '+line;block.append(command);if(r.output){const pre=document.createElement('pre');pre.className='terminal-response';pre.textContent=r.output;block.append(pre)}terminal.append(block)}
   prompt.textContent='alumno@lab:'+r.path+'$';
   result.textContent=r.clear?'Historial visual limpio. Los archivos creados se mantienen.':r.output||'Comando ejecutado.';
   input.value='';historyIndex=engine.getHistory().length;scroll();input.focus();
 };
 const welcome=document.createElement('div');welcome.className='terminal-welcome';welcome.textContent='Entorno preparado. No se ejecuta nada en tu equipo.\nEscribe help para consultar los comandos o experimenta libremente.';terminal.append(welcome);
 $('#run').onclick=run;
 input.addEventListener('keydown',event=>{
   if(event.key==='Enter'){event.preventDefault();run()}
   if(event.key==='ArrowUp'||event.key==='ArrowDown'){event.preventDefault();const h=engine.getHistory();historyIndex=Math.max(0,Math.min(h.length,historyIndex+(event.key==='ArrowUp'?-1:1)));input.value=h[historyIndex]||'';input.setSelectionRange(input.value.length,input.value.length)}
   if(event.key==='Tab'){const token=input.value.trim();if(!token.includes(' ')){const matches=engine.commands().filter(c=>c.startsWith(token.toLowerCase()));if(matches.length===1){event.preventDefault();input.value=matches[0]+' '}}}
 });
 $('#clear').onclick=()=>{engine.reset();terminal.replaceChildren(welcome.cloneNode(true));prompt.textContent='alumno@lab:'+engine.getPath()+'$';input.value='';historyIndex=0;result.textContent='Entorno reiniciado. Tu sistema de archivos de práctica vuelve al estado inicial.';input.focus()};
 const refreshMission=()=>{hintIndex=0;hintResult.replaceChildren();paste.hidden=true;suggestion='';hintButton.disabled=false;hintButton.textContent='💡 Pista 1 de 3';$('#term-goal').textContent=MISSIONS[Number($('#term-mission').value)].goal};
 $('#term-mission').onchange=refreshMission;
 hintButton.onclick=()=>{
   const hint=MISSIONS[Number($('#term-mission').value)].hints[hintIndex];if(!hint)return;
   hintIndex++;
   const p=document.createElement('p');p.textContent='Pista '+hintIndex+': '+hint[0];
   const code=document.createElement('code');code.textContent=hint[1];p.append(code);hintResult.append(p);
   suggestion=hint[1];paste.hidden=false;
   if(hintIndex===3){hintButton.disabled=true;hintButton.textContent='Todas las pistas vistas'}
   else hintButton.textContent='💡 Pista '+(hintIndex+1)+' de 3';
 };
 paste.onclick=()=>{if(!input.value.trim())input.value=suggestion;else input.setRangeText(suggestion,input.selectionStart,input.selectionEnd,'end');input.focus()};
 refreshMission();
}
