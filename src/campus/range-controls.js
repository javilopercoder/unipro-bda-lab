// Accesibilidad: todos los deslizadores también admiten escritura numérica exacta.
const RANGE_EXPLANATIONS={
 V:'Voltaje: energía eléctrica por unidad de carga. Cuanto mayor sea, mayor suele ser la corriente si la resistencia no cambia.',
 r1:'Resistencia R1, en ohmios. Se opone al paso de la corriente eléctrica.',
 r2:'Resistencia R2, en ohmios. Compara serie y paralelo para ver cómo cambia la resistencia equivalente.',
 q:'Carga eléctrica usada para representar el campo.',
 r:'Distancia a la carga. El campo de una carga puntual disminuye con el cuadrado de la distancia.',
 theta:'Ángulo entre las direcciones que intervienen en el cálculo. Sin 90° la componente máxima cambia.',
 a:'Coeficiente cuadrático: modifica la apertura y orientación de la parábola.',
 b:'Coeficiente lineal: cambia la inclinación y posición del vértice de la parábola.',
 c:'Término independiente: desplaza verticalmente la función.',
 x:'Punto sobre el eje horizontal donde se calcula la pendiente de la curva.',
 n:'Número de partes para aproximar una integral: más partes suelen reducir el error.',
 size:'Cantidad o tamaño que genera el experimento. Usa el valor escrito para ajustar la escala sin arrastrar.',
 mean:'Centro teórico de la distribución que quieres generar.',
 spread:'Desviación teórica: cuanto mayor, más dispersos aparecen los datos.',
 sides:'Número de resultados posibles en cada tirada del dado.',
 slope:'Pendiente real que relaciona x e y en los datos generados.',
 noise:'Variación aleatoria añadida a la relación. Más ruido puede dificultar el ajuste.',
 max:'Límite superior N del algoritmo: define hasta qué número avanza el bucle.',
 quantum:'Turno de CPU que recibe un proceso antes de ceder el turno en Round Robin.',
 frames:'Cantidad de marcos disponibles para guardar páginas en memoria.',
 cidr:'Cantidad de bits que identifican la red en una dirección IPv4.',
 hops:'Número de routers o saltos que atraviesa un paquete.',
 bw:'Capacidad de transmisión de la conexión, expresada en megabits por segundo.',
 lat:'Retraso agregado en cada salto de red, en milisegundos.',
 loss:'Porcentaje estimado de pérdida. Más pérdidas provocan más reintentos.',
 l1:'Porcentaje de accesos que la caché L1 resuelve sin consultar niveles inferiores.',
 l2:'Porcentaje de fallos de L1 que resuelve la caché L2.',
 t1:'Tiempo de acceso a caché L1, en nanosegundos.',
 t2:'Tiempo de acceso a caché L2, en nanosegundos.',
 ram:'Tiempo de acceso a memoria principal, más lento que las cachés.',
 dx:'Desplazamiento horizontal de la figura.',
 dy:'Desplazamiento vertical de la figura.',
 angle:'Ángulo con el que gira la figura sobre su centro.',
 scale:'Factor de tamaño: 100 % conserva las dimensiones originales.',
 k:'Número de grupos que intenta encontrar K-means. No tiene por qué coincidir con los grupos naturales.',
 price:'Importe cobrado por cada unidad vendida.',
 variable:'Coste que se genera al vender cada unidad.',
 fixed:'Costes que existen aunque no se venda ninguna unidad.',
 demand:'Número esperado de unidades que se venderán.',
 budget:'Presupuesto total previsto para el proyecto.',
 planned:'Porcentaje que debería haberse completado según el calendario.',
 complete:'Porcentaje de trabajo que realmente está terminado.',
 spent:'Cantidad de dinero gastada hasta ese momento.',
 p1:'Probabilidad asignada al primer riesgo del escenario.',
 p2:'Probabilidad asignada al segundo riesgo del escenario.'
};
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
  const explanation=RANGE_EXPLANATIONS[slider.id];
  if(explanation){
   const button=document.createElement('button');button.type='button';button.className='range-info';
   button.textContent='?';button.setAttribute('aria-label','Explicación de '+(slider.closest('label')?.textContent?.trim()||slider.id));
   button.setAttribute('aria-expanded','false');
   const detail=document.createElement('span');detail.className='range-explanation';detail.hidden=true;detail.textContent=explanation;
   wrapper.append(button);wrapper.insertAdjacentElement('afterend',detail);
   button.onclick=event=>{event.preventDefault();detail.hidden=!detail.hidden;button.setAttribute('aria-expanded',String(!detail.hidden))};
  }
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
