// Accesibilidad: todos los deslizadores también admiten escritura numérica exacta.
export function enhanceRangeControls(root){
 let count=0;
 for(const slider of root.querySelectorAll('input[type="range"]')){
  if(slider.dataset.numericEnhanced)continue;
  slider.dataset.numericEnhanced='true';
  const wrapper=document.createElement('span');wrapper.className='range-duo';
  const typed=document.createElement('input');typed.type='number';typed.className='range-numeric';
  typed.dataset.rangeFor=slider.id||'range'+count;
  typed.setAttribute('aria-label','Escribir valor de '+(slider.closest('label')?.textContent?.trim()||'control numérico'));
  if(slider.min!=='')typed.min=slider.min;
  if(slider.max!=='')typed.max=slider.max;
  typed.step=slider.step||'1';
  typed.value=slider.value;
  slider.parentElement.insertBefore(wrapper,slider);
  wrapper.append(slider,typed);
  const updateNumber=()=>{typed.value=slider.value};
  slider.addEventListener('input',updateNumber);
  const change=()=>{
   if(typed.value===''||typed.value==='-'||typed.value==='.')return;
   const value=Number(typed.value);if(!Number.isFinite(value))return;
   slider.value=String(value);slider.dispatchEvent(new Event('input',{bubbles:true}));
   const target=root.querySelector('[data-value="'+CSS.escape(slider.id)+'"]')||root.querySelector('[data-val="'+CSS.escape(slider.id)+'"]');
   if(target)target.textContent=slider.value+(target.dataset.unit||'');
  };
  typed.addEventListener('input',change);
  typed.addEventListener('change',()=>{change();typed.value=slider.value});
  typed.addEventListener('blur',()=>{typed.value=slider.value});
  count++;
 }
 return count;
}
