import {test,expect} from '@playwright/test';

test('auditoría: todos los retos presentan los controles que piden',async({page})=>{
 test.setTimeout(200000);
 await page.goto('/');
 const labs=await page.evaluate(async()=>{
  const m=await import('/src/campus/catalog.js');
  return m.SUBJECTS.flatMap(s=>s.labs.filter(l=>l.type!=='bda').map(l=>l.id));
 });
 const missing=[];
 for(const id of labs){
  await page.goto('/#/practica/'+id);
  const check=await page.evaluate(async()=>{
   const id=location.hash.split('/').pop();
   const {getLab}=await import('/src/campus/catalog.js');
   const {lessonFor}=await import('/src/campus/academy.js');
   const lab=getLab(id),requirement=lessonFor(lab).verify;
   const root=document.querySelector('#lab-root');
   if(!root)return['Sin motor'];
   return requirement.split('&').filter(Boolean).flatMap(condition=>{
    const k=condition.split('=')[0];
    if(k==='@button')return root.querySelector('button')?[]:['Sin botón'];
    if(k==='@input')return root.querySelector('input,select,textarea')?[]:['Sin control editable'];
    if(k.startsWith('@'))return root.querySelector('#'+CSS.escape(k.slice(1)))?[]:['Sin acción '+k];
    return root.querySelector('#'+CSS.escape(k))?[]:['Sin control '+k];
   });
  });
  for(const issue of check)missing.push(id+': '+issue);
 }
 expect(missing).toEqual([]);
});
