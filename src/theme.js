// Tema compartido entre campus y BDA. Preferencia accesible y local.
const KEY='unipro-lab-theme';
const media=window.matchMedia?.('(prefers-color-scheme: dark)');
let stored=null;
try { const v=localStorage.getItem(KEY); if(v==='light'||v==='dark')stored=v; }catch{}
const current=()=>stored||(media?.matches?'dark':'light');
function apply(){
  const value=current();
  document.documentElement.dataset.theme=value;
  document.documentElement.style.colorScheme=value;
  const meta=document.querySelector('meta[name="theme-color"]');
  if(meta)meta.setAttribute('content',value==='dark'?'#0b1220':'#f5f7fc');
  for(const b of document.querySelectorAll('[data-theme-toggle]')){
    b.setAttribute('aria-label',value==='dark'?'Cambiar a modo claro':'Cambiar a modo oscuro');
    b.setAttribute('title',value==='dark'?'Activar modo claro':'Activar modo oscuro');
    b.setAttribute('aria-pressed',String(value==='dark'));
    b.textContent=value==='dark'?'☀️':'🌙';
  }
}
apply();
media?.addEventListener?.('change',()=>{if(!stored)apply()});
export function mountThemeToggle(element){
  if(!element)return;
  const b=document.createElement('button');
  b.type='button';b.className='theme-toggle';b.dataset.themeToggle='true';
  b.onclick=()=>{stored=current()==='dark'?'light':'dark';try{localStorage.setItem(KEY,stored)}catch{}apply()};
  element.prepend(b);apply();
}
export const themePreference=()=>current();
