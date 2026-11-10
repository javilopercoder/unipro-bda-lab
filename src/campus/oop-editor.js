// Editor orientado a objetos: muestra polimorfismo con un subconjunto explícito de sintaxis JS.
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const defaults={Vehiculo:'se mueve',Coche:'acelera',Bicicleta:'pedalea'};
export function parseMethodOverride(source){
 const text=String(source||'').trim();
 if(!text)throw Error('Todavía no has escrito una definición. Puedes empezar con una pista.');
 if(text.length>1000)throw Error('La definición es demasiado larga.');
 const match=/^class\s+(Vehiculo|Coche|Bicicleta)\s*(?:extends\s+Vehiculo\s*)?\{\s*mover\(\)\s*\{\s*return\s+(["'])(.{1,80})\2\s*;?\s*\}\s*\}$/s.exec(text);
 if(!match)throw Error('Utiliza class Nombre extends Vehiculo { mover() { return "texto"; } }. El intérprete solo admite esa estructura.');
 return{kind:match[1],message:match[3]};
}
const codeSamples=[
 ['La clase define el tipo de objeto. Prueba la palabra class y el nombre.', 'class Bicicleta'],
 ['extends indica que una clase hereda de Vehiculo; mover() es el método que vamos a personalizar.', 'class Bicicleta extends Vehiculo {\n  mover() {'],
 ['return devuelve el comportamiento que observarás al llamar a mover().','class Bicicleta extends Vehiculo {\n  mover() {\n    return "pedalea con energía";\n  }\n}']
];
export function renderObjectEditor(root){
 const options='<option value="Vehiculo">Vehículo</option><option value="Coche">Coche</option><option value="Bicicleta">Bicicleta</option>';
 root.innerHTML='<div class="oop-lab"><p class="lab-intro">Una clase define un tipo de objeto. Varias clases pueden tener un método llamado <code>mover()</code> con comportamientos diferentes. Prueba primero los botones; después modifica el método desde el editor.</p>'+
 '<div class="controls"><label class="control">Tipo de objeto <select id="class">'+options+'</select></label><button type="button" id="instantiate" class="btn">Crear objeto</button><button type="button" id="call" class="btn">Llamar a mover()</button><button type="button" id="clear" class="btn">Vaciar objetos</button></div>'+
 '<div class="oop-inheritance"><span>Vehiculo</span><b>↘</b><span>Coche</span><b>↗</b><span>Bicicleta</span></div>'+
 '<div id="lab-output" class="output-card" aria-live="polite">Elige una clase y crea un objeto para comenzar.</div>'+
 '<div id="lab-viz" class="visual-card" aria-label="Objetos creados"></div>'+
 '<div class="oop-code-frame"><header><span>Editor de métodos · sintaxis JS guiada</span><small>Opcional</small></header>'+
 '<textarea id="oop-code" spellcheck="false" autocapitalize="off" aria-label="Escribe el código del método mover" placeholder="Escribe tu definición de clase…" ></textarea>'+
 '<div class="oop-code-actions"><button type="button" id="oop-apply" class="btn">Aplicar método al simulador</button><button type="button" id="oop-hint" class="btn">Pista 1 de 3</button><button type="button" id="oop-insert" class="btn" hidden>Insertar fragmento</button></div>'+
 '<div id="oop-hint-result" aria-live="polite" class="oop-hint-result"></div></div>'+
 '<p class="subtle">El editor interpreta una definición limitada de clase y método. No ejecuta JavaScript arbitrario y no modifica nada fuera del laboratorio.</p></div>';
 const $=selector=>root.querySelector('#'+selector);
 const behaviors={...defaults};let objects=[],nextId=1,hints=0,lastSnippet='';
 const draw=message=>{
   const value=message||'Los objetos de distintas clases responden a mover() según su implementación.';
   $('lab-output').innerHTML='<strong>'+objects.length+' objeto(s)</strong><p>'+esc(value)+'</p>';
   $('lab-viz').innerHTML='<div class="object-grid">'+objects.map(o=>'<div class="object-card"><b>#'+o.id+' '+esc(o.kind)+'</b><span>mover() → '+esc(behaviors[o.kind])+'</span></div>').join('')+'</div>';
 };
 $('instantiate').onclick=()=>{if(objects.length<24)objects.push({id:nextId++,kind:$('class').value});draw('Objeto creado. Ahora llama a mover() para observar el comportamiento.')};
 $('call').onclick=()=>draw(objects.length?objects.map(o=>'#'+o.id+' '+o.kind+': '+behaviors[o.kind]).join(' · '):'Primero crea un objeto. Luego podrás invocar mover().');
 $('clear').onclick=()=>{objects=[];draw('Lista de objetos vacía. Puedes crear más.')};
 $('oop-apply').onclick=()=>{
   try{const {kind,message}=parseMethodOverride($('oop-code').value);behaviors[kind]=message;draw('Método mover() actualizado para '+kind+'. Crea un objeto de esa clase y vuelve a invocarlo.')}
   catch(e){draw(e.message)}
 };
 const hintButton=$('oop-hint'),insert=$('oop-insert');
 hintButton.onclick=()=>{
   if(hints>=codeSamples.length)return;
   const [explanation,fragment]=codeSamples[hints];hints++;lastSnippet=fragment;
   const p=document.createElement('p');p.textContent='Pista '+hints+': '+explanation;
   const code=document.createElement('code');code.textContent=fragment;p.append(code);$('oop-hint-result').append(p);
   insert.hidden=false;hintButton.disabled=hints===3;hintButton.textContent=hints===3?'✓ Todas las pistas':'Pista '+(hints+1)+' de 3';
 };
 insert.onclick=()=>{
   const editor=$('oop-code');
   if(!editor.value.trim()||codeSamples.some(x=>x[1]===editor.value.trim()))editor.value=lastSnippet;
   else editor.setRangeText(lastSnippet,editor.selectionStart,editor.selectionEnd,'end');
   editor.focus();
 };
 draw();
}
