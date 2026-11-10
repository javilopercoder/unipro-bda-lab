// Simulaciones numéricas originales. Nada se evalúa mediante eval() ni Function().
const $=(r,s)=>r.querySelector(s);
const num=(r,s)=>Number($(r,s).value);
const clamp=(x,lo,hi)=>Math.min(hi,Math.max(lo,x));
const fixed=(n,d=3)=>Number.isFinite(n)?Number(n).toFixed(d):'—';
function shell(root,desc,controls){root.innerHTML='<p class="lab-intro">'+desc+'</p><div class="controls">'+controls+'</div><div class="output-card" id="lab-output" aria-live="polite"></div><div class="visual-card" id="lab-viz"></div>';return {out:$('#lab-output'),viz:$('#lab-viz')}}
const slider=(id,label,min,max,value,step=1)=>'<label class="control"><span>'+label+' <b data-value="'+id+'">'+value+'</b></span><input type="range" id="'+id+'" min="'+min+'" max="'+max+'" value="'+value+'" step="'+step+'"></label>';
const select=(id,label,values)=>'<label class="control"><span>'+label+'</span><select id="'+id+'">'+values.map(([v,n])=>'<option value="'+v+'">'+n+'</option>').join('')+'</select></label>';
const button=(id,label)=>'<button type="button" id="'+id+'" class="btn">'+label+'</button>';
const htm=(x)=>String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
export function renderMath(root,lab,complete){
 const t=lab.type;
 if(t==='matrix'){
 const {out,viz}=shell(root,'Edita una matriz de 3×3. Calcula el determinante por Sarrus y comprueba cómo cambia al modificar una celda.',button('random','Generar matriz nueva'));
 let state=0;const draw=()=>{const M=[];for(let i=0;i<9;i++)M.push(Number(root.querySelector('#m'+i)?.value||0));const [a,b,c,d,e,f,g,h,i]=M;const positive=a*e*i+b*f*g+c*d*h,negative=c*e*g+b*d*i+a*f*h;out.innerHTML='<strong>Determinante: '+(positive-negative)+'</strong><p>Diagonales descendentes: '+positive+' · ascendentes: '+negative+'</p><p>det(A) = '+positive+' − ('+negative+') = '+(positive-negative)+'</p>';};
 const generate=()=>{state++;viz.innerHTML='<div class="matrix-grid">'+Array.from({length:9},(_,i)=>'<input aria-label="fila '+(Math.floor(i/3)+1)+' columna '+(i%3+1)+'" id="m'+i+'" type="number" value="'+(((i*7+state*3)%11)-5)+'"></input>').join('')+'</div>';viz.querySelectorAll('input').forEach(el=>el.oninput=draw);draw()};root.querySelector('#random').onclick=()=>{generate();complete()};generate();return;
 }
 if(t==='logic'){
 const {out,viz}=shell(root,'Cambia las entradas de la ALU y elige una puerta lógica. Se recalcula la tabla de verdad.',select('op','Operación',[['AND','AND'],['OR','OR'],['XOR','XOR'],['NAND','NAND'],['NOT','NOT A'],['ADD','Suma 8 bits']])+slider('a','A (0–255)',0,255,5)+slider('b','B (0–255)',0,255,3));
 const update=()=>{const A=num(root,'#a'),B=num(root,'#b'),op=$('#op').value;let val=op==='AND'?(A&B):op==='OR'?(A|B):op==='XOR'?(A^B):op==='NAND'?((~(A&B))&255):op==='NOT'?((~A)&255):((A+B)&255);out.innerHTML='<strong>Resultado decimal: '+val+'</strong><p>Resultado binario de 8 bits: <code>'+val.toString(2).padStart(8,'0')+'</code></p><p>A: '+A.toString(2).padStart(8,'0')+' · B: '+B.toString(2).padStart(8,'0')+'</p>';viz.innerHTML='<div class="bit-row">'+val.toString(2).padStart(8,'0').split('').map(x=>'<span class="bit '+(x==='1'?'on':'')+'">'+x+'</span>').join('')+'</div>';complete()};
 $('#op').onchange=update;root.querySelectorAll('input').forEach(x=>x.oninput=update);update();return;
 }
 if(t==='circuit'){
 const {out,viz}=shell(root,'Una fuente alimenta dos resistencias. Cambia sus valores y observa intensidad, resistencia equivalente y potencia disipada.',slider('V','Voltaje V',1,30,12)+slider('r1','Resistencia R₁ (Ω)',1,100,20)+slider('r2','Resistencia R₂ (Ω)',1,100,30)+select('mode','Montaje',[['series','Serie'],['parallel','Paralelo']]));
 const update=()=>{const V=num(root,'#V'),r1=num(root,'#r1'),r2=num(root,'#r2'),series=$('#mode').value==='series',Req=series?r1+r2:r1*r2/(r1+r2),I=V/Req,P=V*I;out.innerHTML='<strong>R equivalente = '+fixed(Req,2)+' Ω</strong><p>I total = '+fixed(I)+' A · P = '+fixed(P,2)+' W</p><p>'+ (series?'En serie circula la misma corriente por ambas resistencias.':'En paralelo ambas resistencias tienen el mismo voltaje.')+'</p>';viz.innerHTML='<div class="circuit-diagram"><span>⚡ '+V+' V</span><span class="resistor">R₁ '+r1+' Ω</span><span class="circuit-link">'+(series?'──':'║')+'</span><span class="resistor">R₂ '+r2+' Ω</span></div>';complete()};
 root.querySelectorAll('input').forEach(el=>el.oninput=update);$('#mode').onchange=update;update();return;
 }
 if(t==='waves'){
 const {out,viz}=shell(root,'Explora cómo depende el campo eléctrico de la distancia y cómo varía una fuerza magnética con el ángulo.',slider('q','Carga (nC)',1,20,5)+slider('r','Distancia (m)',1,10,3,.25)+slider('theta','Ángulo (°)',0,180,60));
 const update=()=>{const q=num(root,'#q'),r=num(root,'#r'),theta=num(root,'#theta'),E=8.988e9*q*1e-9/(r*r),F=0.4*Math.sin(theta*Math.PI/180);out.innerHTML='<strong>Campo E = '+fixed(E,3)+' N/C</strong><p>Ley 1/r²: duplicar la distancia reduce E a una cuarta parte.</p><p>Ejemplo magnético normalizado: F ∝ sin('+theta+'°) = '+fixed(F/0.4,3)+'</p>';viz.innerHTML='<svg viewBox="0 0 600 190" role="img" aria-label="Intensidad del campo según distancia"><line x1="35" y1="160" x2="575" y2="160" stroke="currentColor"/>'+Array.from({length:55},(_,i)=>{const d=1+i*9/54,y=160-130*(1/(d*d));return i?'<circle cx="'+(40+i*9.5)+'" cy="'+y+'" r="2.2" fill="#4387ef"/>':''}).join('')+'</svg>';complete()};root.querySelectorAll('input').forEach(x=>x.oninput=update);update();return;
 }
 if(t==='calculus'){
 const {out,viz}=shell(root,'Manipula una parábola f(x)=ax²+bx+c. La tangente y la integral se calculan con tus parámetros.',slider('a','Coeficiente a',-3,3,1,.25)+slider('b','Coeficiente b',-5,5,-1,.25)+slider('c','Coeficiente c',-5,5,1,.25)+slider('x','Punto de tangencia x',-3,3,1,.25)+slider('n','Particiones para integrar de 0 a 2',2,100,20));
 const update=()=>{const a=num(root,'#a'),b=num(root,'#b'),c=num(root,'#c'),x=num(root,'#x'),n=num(root,'#n'),f=z=>a*z*z+b*z+c,d=2*a*x+b;let I=0;for(let k=0;k<n;k++){const lo=2*k/n,hi=2*(k+1)/n;I+=(f(lo)+f(hi))*(hi-lo)/2}const exact=(8*a/3+2*b+2*c);out.innerHTML='<strong>f('+x+') = '+fixed(f(x))+' · f′('+x+') = '+fixed(d)+'</strong><p>Integral trapezoidal [0,2] = '+fixed(I,5)+' · exacta = '+fixed(exact,5)+'</p><p>Error absoluto = '+fixed(Math.abs(I-exact),7)+'</p>';const pts=Array.from({length:151},(_,i)=>{const z=-4+i*8/150;return ((z+4)*73.5).toFixed(1)+','+clamp(108-f(z)*12,-300,500).toFixed(1)});viz.innerHTML='<svg viewBox="0 0 590 220" role="img" aria-label="Gráfica de función cuadrática y tangente"><path d="M0 108H590 M295 0V220" stroke="#94a3b8" fill="none"/><polyline points="'+pts.join(' ')+'" fill="none" stroke="#2563eb" stroke-width="3"/><line x1="0" y1="'+(108-(f(x)+d*(-4-x))*12)+'" x2="590" y2="'+(108-(f(x)+d*(4-x))*12)+'" stroke="#e88e32" stroke-width="2" stroke-dasharray="5 6"/><circle cx="'+((x+4)*73.5)+'" cy="'+(108-f(x)*12)+'" r="6" fill="#d65b34"/></svg>';complete()};root.querySelectorAll('input').forEach(x=>x.oninput=update);update();return;
 }
 if(t==='roots'){
 const f=x=>x*x*x-x-2;let lo=1,hi=2,steps=0;const {out,viz}=shell(root,'Busca la raíz de f(x)=x³−x−2 mediante el método de bisección. Cada paso reduce el intervalo.',button('step','Siguiente iteración')+button('reset','Reiniciar'));
 const draw=()=>{const m=(lo+hi)/2;out.innerHTML='<strong>Intervalo ['+fixed(lo,6)+', '+fixed(hi,6)+']</strong><p>Mitad: '+fixed(m,7)+' · f(m): '+fixed(f(m),7)+'</p><p>Longitud del intervalo: '+fixed(hi-lo,8)+' · iteraciones: '+steps+'</p>';viz.innerHTML='<div class="interval"><span>'+fixed(lo,5)+'</span><div><span class="marker" style="left:50%"></span></div><span>'+fixed(hi,5)+'</span></div>'};
 $('#step').onclick=()=>{const m=(lo+hi)/2;if(f(lo)*f(m)<=0)hi=m;else lo=m;steps++;draw();complete()};$('#reset').onclick=()=>{lo=1;hi=2;steps=0;draw()};draw();return;
 }
 if(t==='statistics'||t==='montecarlo'){
 const mc=t==='montecarlo';
 const {out,viz}=shell(root,mc?'Simula lanzamientos de dados y observa cómo se estabilizan las frecuencias.':'Genera muestras ficticias y compara distribución, media, desviación y mediana.',slider('size','Observaciones',100,20000,2000,100)+(mc?slider('sides','Caras del dado',2,12,6):slider('mean','Media teórica',-20,20,5,.5)+slider('spread','Desviación teórica',1,15,5,.5))+button('sample','Nueva muestra'));
 let seed=123456789;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 const update=()=>{seed=(seed+1234567)>>>0;const n=num(root,'#size'),arr=[];for(let i=0;i<n;i++){if(mc)arr.push(Math.floor(rand()*num(root,'#sides'))+1);else{const x=Math.sqrt(-2*Math.log(Math.max(rand(),1e-9)))*Math.cos(2*Math.PI*rand());arr.push(num(root,'#mean')+x*num(root,'#spread'))}}
 const average=arr.reduce((a,b)=>a+b,0)/n,variance=arr.reduce((a,b)=>a+(b-average)**2,0)/n,sorted=[...arr].sort((a,b)=>a-b);out.innerHTML='<strong>'+n.toLocaleString('es-ES')+' valores generados</strong><p>Media: '+fixed(average,3)+' · mediana: '+fixed((sorted[Math.floor((n-1)/2)]+sorted[Math.floor(n/2)])/2,3)+' · desviación: '+fixed(Math.sqrt(variance),3)+'</p>';const k=mc?num(root,'#sides'):20,counts=Array(k).fill(0),lo=mc?1:num(root,'#mean')-4*num(root,'#spread'),hi=mc?k+1:num(root,'#mean')+4*num(root,'#spread');for(const v of arr){const j=clamp(Math.floor((v-lo)/(hi-lo)*k),0,k-1);counts[j]++}const max=Math.max(...counts,1);viz.innerHTML='<div class="histogram">'+counts.map((x,i)=>'<div class="hist-bar" title="Grupo '+(i+1)+': '+x+'" style="height:'+Math.max(2,x/max*100)+'%"></div>').join('')+'</div>';complete()};
 root.querySelectorAll('input').forEach(el=>el.oninput=update);$('#sample').onclick=update;update();return;
 }
 if(t==='regression'){
 const {out,viz}=shell(root,'Genera pares (x,y) y ajusta una recta por mínimos cuadrados. Cambia el ruido para observar R².',slider('slope','Pendiente real',-4,4,2,.1)+slider('noise','Ruido',0,10,2,.5)+button('generate','Nuevos datos'));
 let seed=317;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 const update=()=>{const slope=num(root,'#slope'),noise=num(root,'#noise'),data=Array.from({length:100},(_,i)=>{const x=i/10-5;return {x,y:2+slope*x+(rand()-.5)*2*noise}});const meanX=data.reduce((s,v)=>s+v.x,0)/100,meanY=data.reduce((s,v)=>s+v.y,0)/100;let sxx=0,sxy=0,syy=0;for(const d of data){sxx+=(d.x-meanX)**2;sxy+=(d.x-meanX)*(d.y-meanY);syy+=(d.y-meanY)**2}const b=sxy/sxx,a=meanY-b*meanX,r2=syy?1-(syy-sxy*sxy/sxx)/syy:1;out.innerHTML='<strong>Modelo estimado: y = '+fixed(a,3)+' + '+fixed(b,3)+'x</strong><p>R² = '+fixed(r2,4)+' · muestra: 100 puntos ficticios</p>';viz.innerHTML='<svg viewBox="0 0 600 260"><path d="M30 130H580" stroke="#cbd5e1"/>'+data.map(d=>'<circle cx="'+(300+d.x*48)+'" cy="'+clamp(130-d.y*8,7,253)+'" r="3" fill="#60a5fa" opacity=".65"/>').join('')+'<path d="M60 '+(130-(a-5*b)*8)+' L540 '+(130-(a+5*b)*8)+'" stroke="#f97316" stroke-width="3"/></svg>';complete()};
 root.querySelectorAll('input').forEach(el=>el.oninput=update);$('#generate').onclick=update;update();return;
 }
}
export const MATH_TYPES=new Set(['matrix','logic','circuit','waves','calculus','roots','statistics','montecarlo','regression']);
