// Mejora progresiva de cualquier input[type=range], sin reescribir los 48 motores.
export function enhanceNumericRanges(root){
 const sliders=[...root.querySelectorAll('input[type="range"]')];
 for(const slider of sliders){
  if(slider.dataset.numericEnhanced==='true')continue;
  slider.dataset.numericEnhanced='true';
  const controls=document.createElement('div');controls.className='range-with-number';
  const number=document.createElement('input');
  number.type='number';number.className='range-number';
  number.id='number-for-'+slider.id;number.dataset.forRange=slider.id;
  number.setAttribute('aria-label','Introducir directamente '+(slider.closest('label')?.textContent||slider.id).trim());
  number.min=slider.min;number.max=slider.max;
  number.step=slider.step||'1';number.value=slider.value;
  controls.setAttribute('role','group');
  slider.parentNode.insertBefore(controls,slider);
  controls.append(slider,number);
  const syncSlider=()=>{
   const candidate=Number(number.value);
   if(number.value===''||!Number.isFinite(candidate))return;
   const min=Number(slider.min),max=Number(slider.max);
   slider.value=String(Math.min(max,Math.max(min,candidate)));
   number.value=slider.value;
   slider.dispatchEvent(new Event('input',{bubbles:true}));
   slider.dispatchEvent(new Event('change',{bubbles:true}));
  };
  // Con cada valor válido se recalculan las visualizaciones de inmediato.
  number.addEventListener('input',syncSlider);
  number.addEventListener('change',syncSlider);
  slider.addEventListener('input',()=>{number.value=slider.value});
  // No se sobrescriben ni los controladores existentes ni el propio slider.
 }
 return sliders.length;
}
