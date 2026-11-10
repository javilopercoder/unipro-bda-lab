// Sarrus interactivo: un único origen para números, trazos, productos y determinante.
const PRESETS={
  example:[1,2,0,0,1,3,2,0,1],
  identity:[1,0,0,0,1,0,0,0,1],
  singular:[1,2,3,2,4,6,1,0,1],
};
export function sarrusProducts(values){
  if(!Array.isArray(values)||values.length!==9||values.some(n=>!Number.isFinite(n)))throw Error('La matriz debe contener nueve números válidos');
  const down=[[0,4,8],[1,5,6],[2,3,7]];
  const up=[[6,4,2],[7,5,0],[8,3,1]];
  const mk=indices=>indices.map((cells,start)=>({cells,start,nums:cells.map(i=>values[i]),value:cells.reduce((acc,i)=>acc*values[i],1)}));
  const positive=mk(down),negative=mk(up);
  const sumDown=positive.reduce((s,p)=>s+p.value,0),sumUp=negative.reduce((s,p)=>s+p.value,0);
  return{positive,negative,sumDown,sumUp,determinant:sumDown-sumUp};
}
const escapeHTML=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function diagram(values,active){
  const nx=col=>68+col*96,ny=row=>51+row*72;
  const isDown=active<3,start=active%3;
  const cells=isDown?[[0,start],[1,start+1],[2,start+2]]:[[2,start],[1,start+1],[0,start+2]];
  const point=cells.map(([row,col])=>nx(col)+','+ny(row)).join(' ');
  const text=Array.from({length:3},(_,row)=>Array.from({length:5},(_,col)=>{
    const value=values[row*3+col%3],highlight=cells.some(([r,c])=>r===row&&c===col),copy=col>2;
    return '<g><rect x="'+(nx(col)-30)+'" y="'+(ny(row)-25)+'" width="60" height="50" rx="12" class="'+(highlight?'mx-svg-active '+(isDown?'mx-svg-positive':'mx-svg-negative'):copy?'mx-svg-copy':'mx-svg-cell')+'"/><text x="'+nx(col)+'" y="'+(ny(row)+7)+'" text-anchor="middle" class="mx-svg-text">'+value+'</text></g>';
  }).join('')).join('');
  return '<svg viewBox="0 0 545 252" role="img" aria-label="Matriz ampliada: diagonal '+(active+1)+' resaltada. Las dos últimas columnas son una copia de las primeras.">'+
    '<rect x="0" y="0" width="545" height="252" rx="18" class="mx-svg-background"/>'+
    '<text x="68" y="16" class="mx-svg-label">MATRIZ A</text><text x="382" y="16" class="mx-svg-label">COPIA PARA SARRUS</text>'+
    '<line x1="317" y1="25" x2="317" y2="239" stroke-dasharray="4 7" class="mx-svg-separator"/>'+
    text+
    '<polyline points="'+point+'" fill="none" stroke-linecap="round" stroke-linejoin="round" class="'+(isDown?'mx-path-positive':'mx-path-negative')+'"/>'+
    cells.map(([row,col])=>'<circle cx="'+nx(col)+'" cy="'+ny(row)+'" r="29" fill="none" class="'+(isDown?'mx-ring-positive':'mx-ring-negative')+'"/>').join('')+
    '</svg>';
}
export function renderMatrix(root){
  let values=[...PRESETS.example],step=0,randomSeed=417;
  const matrixCells=values.map((v,i)=>'<label class="mx-cell"><span class="sr-only">Fila '+(Math.floor(i/3)+1)+', columna '+(i%3+1)+'</span><input type="number" step="1" id="m'+i+'" aria-label="fila '+(Math.floor(i/3)+1)+' columna '+(i%3+1)+'" value="'+v+'" /></label>').join('');
  root.innerHTML='<div class="matrix-lab"><div class="mx-workbench">'+
    '<section class="mx-editor"><div class="mx-minihead"><span>01 · LA MATRIZ</span><span class="mx-pill">3 × 3</span></div><p class="mx-caption">Cada casilla es un número. Cambia cualquiera y todos los cálculos se actualizarán.</p><div class="mx-editor-area"><span class="mx-bracket-left"></span><div class="matrix-grid">'+matrixCells+'</div><span class="mx-bracket-right"></span></div><div class="mx-presets"><button type="button" class="mx-preset" data-preset="example">Ejemplo</button><button type="button" class="mx-preset" data-preset="identity">Identidad</button><button type="button" class="mx-preset" data-preset="singular">Sin inversa</button><button type="button" class="mx-preset" id="random">↻ Aleatoria</button></div></section>'+
    '<section class="mx-explainer"><div class="mx-minihead"><span>02 · SIGUE LAS DIAGONALES</span><span id="mx-counter" class="mx-pill">1 de 6</span></div><p class="mx-caption">Las dos primeras columnas se copian a la derecha para seguir cada diagonal.</p><div class="mx-diagram" id="mx-diagram"></div><div class="mx-step"><div class="mx-step-label"><span class="mx-dot"></span><b id="mx-direction">Suma las que bajan</b></div><p id="mx-multiply" class="mx-multiply"></p></div><div class="mx-step-actions"><button type="button" class="mx-action-subtle" id="mx-prev">← Anterior</button><div class="mx-dots" id="mx-dots" aria-hidden="true"></div><button type="button" class="mx-action-primary" id="mx-next">Siguiente diagonal →</button></div></section>'+
    '</div><div class="mx-result" id="lab-output" aria-live="polite"></div>'+
    '<details class="mx-why"><summary>¿Para qué sirve un determinante?</summary><p>Un determinante distinto de cero indica que la matriz tiene inversa. Si vale cero, no puedes resolver un sistema con esa inversa, porque algunas filas o columnas no aportan información independiente.</p></details></div>';
  const inputs=[...root.querySelectorAll('.matrix-grid input')];
  const setPreset=kind=>{
    if(kind==='random'){randomSeed=(Math.imul(randomSeed,1664525)+1013904223)>>>0;values=Array.from({length:9},(_,i)=>((randomSeed>>>((i%5)*4))+(i*7))%9-4)}
    else values=[...PRESETS[kind]];
    inputs.forEach((el,i)=>{el.value=values[i]});step=0;draw();
  };
  const draw=()=>{
    const {positive,negative,sumDown,sumUp,determinant}=sarrusProducts(values),all=[...positive,...negative],current=all[step],down=step<3;
    root.querySelector('#mx-diagram').innerHTML=diagram(values,step);
    root.querySelector('#mx-counter').textContent=(step+1)+' de 6';
    const direction=root.querySelector('#mx-direction');
    direction.textContent=down?'Suma las que bajan ↘':'Resta las que suben ↗';
    direction.parentElement.classList.toggle('mx-up',!down);
    const multiply=root.querySelector('#mx-multiply');
    multiply.innerHTML='<span>'+current.nums.map(escapeHTML).join(' × ')+'</span> = <strong>'+current.value+'</strong>';
    root.querySelector('#mx-dots').innerHTML=all.map((_,i)=>'<i class="'+(i===step?'active ':'')+(i>2?'negative':'positive')+'"></i>').join('');
    root.querySelector('#mx-prev').disabled=step===0;
    root.querySelector('#mx-next').textContent=step===5?'Volver al inicio ↻':'Siguiente diagonal →';
    const sumEquation=positive.map(p=>p.value).join(' + '),minusEquation=negative.map(p=>p.value).join(' + ');
    const result=root.querySelector('#lab-output');
    result.innerHTML='<div class="mx-result-main"><div><span>Determinante</span><strong id="mx-determinant">'+determinant+'</strong></div><div class="mx-result-status '+(determinant===0?'mx-singular':'mx-invertible')+'">'+(determinant===0?'⚠ Sin inversa':'✓ Tiene inversa')+'</div></div>'+
      '<div class="mx-formula"><div class="mx-formula-line"><span class="mx-positive-tag">↘ Suman</span><code>'+escapeHTML(sumEquation)+' = '+sumDown+'</code></div><div class="mx-formula-line"><span class="mx-negative-tag">↗ Restan</span><code>'+escapeHTML(minusEquation)+' = '+sumUp+'</code></div></div>'+
      '<p class="mx-formula-final">det(A) = '+sumDown+' − ('+sumUp+') = <strong>'+determinant+'</strong></p>';
  };
  inputs.forEach((el,i)=>{el.addEventListener('input',()=>{
    const n=Number(el.value);
    if(el.value.trim()!==''&&Number.isFinite(n)&&Math.abs(n)<1e6){values[i]=n;el.removeAttribute('aria-invalid');draw()}
    else el.setAttribute('aria-invalid','true');
  })});
  root.querySelectorAll('[data-preset]').forEach(el=>el.onclick=()=>setPreset(el.dataset.preset));
  root.querySelector('#random').onclick=()=>setPreset('random');
  root.querySelector('#mx-prev').onclick=()=>{step=Math.max(0,step-1);draw()};
  root.querySelector('#mx-next').onclick=()=>{step=(step+1)%6;draw()};
  draw();
}
