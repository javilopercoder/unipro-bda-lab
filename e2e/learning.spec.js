import {test,expect} from '@playwright/test';

test('una persona sin conocimientos encuentra concepto, ejemplo y misión',async({page})=>{
 await page.goto('/#/practica/amd-1');
 await expect(page.getByRole('heading',{name:/Así funciona. Mira este ejemplo/})).toBeVisible();
 await expect(page.locator('.lesson-example li')).toHaveCount(3);
 await expect(page.locator('.mission-challenge')).not.toBeEmpty();
 await expect(page.locator('#mission-hints')).toBeEmpty();
 await page.locator('#mission-check').click();
 await expect(page.locator('#mission-feedback')).toContainText('Todavía falta algo');
 await page.locator('#mission-hint').click();
 await expect(page.locator('#mission-hints p')).toHaveCount(1);
 await page.locator('#mission-hint').click();await page.locator('#mission-hint').click();
 await expect(page.locator('#mission-hints p')).toHaveCount(3);
 await expect(page.locator('#mission-hint')).toBeDisabled();
 await page.locator('#m0').fill('9');
 await page.locator('#mission-check').click();
 await expect(page.locator('#mission-feedback')).toContainText('Misión realizada');
 await expect(page.locator('[data-progress="amd-1"]')).toContainText('Misión realizada');
 await page.reload();
 await expect(page.locator('[data-progress="amd-1"]')).toContainText('Misión realizada');
});

test('bisección: la misión necesita cuatro acciones de verdad',async({page})=>{
 await page.goto('/#/practica/cmn-2');
 await expect(page.locator('.lesson-example li')).toHaveCount(3);
 await page.locator('#mission-check').click();
 await expect(page.locator('#mission-feedback')).toContainText('Todavía');
 for(let i=0;i<3;i++)await page.locator('#step').click();
 await page.locator('#mission-check').click();
 await expect(page.locator('#mission-feedback')).toContainText('Todavía');
 await page.locator('#step').click();
 await page.locator('#mission-check').click();
 await expect(page.locator('#mission-feedback')).toContainText('Misión realizada');
});

test('las 30 asignaturas muestran seis prácticas distintas y enlazables',async({page})=>{
 await page.goto('/');
 await expect(page.locator('.subject-card')).toHaveCount(30);
 const subjects=await page.evaluate(async()=>{
  const m=await import('/src/campus/catalog.js');
  return m.SUBJECTS.map(s=>({id:s.id,links:s.labs.map(l=>l.id)}));
 });
 expect(subjects).toHaveLength(30);
 for(const subject of subjects){
  expect(new Set(subject.links).size).toBe(6);
  await page.goto('/#/asignatura/'+subject.id);
  await expect(page.locator('.lab-card')).toHaveCount(6);
 }
});

test('el BDA mantiene su motor e incorpora explicaciones en todos los modos',async({page})=>{
 test.setTimeout(90000);
 for(const mode of ['sql','mongo','xml','redis','transactions','plans','analytics','distributed']){
  await page.goto('/bda.html#'+mode);
  await expect(page.locator('.bda-guide')).toBeVisible();
  await expect(page.locator('.bda-guide-example li')).toHaveCount(3);
  await page.locator('#bda-hint-next').click();
  await expect(page.locator('#bda-guide-hints p')).toHaveCount(1);
 }
 await page.goto('/#/practica/bda-4');
 await expect(page.locator('.lesson-example li')).toHaveCount(3);
 await expect(page.getByRole('link',{name:/Abrir MongoDB/})).toHaveAttribute('href','./bda.html#mongo');
});

test('180 prácticas: modo oscuro legible en ejemplos y objetivos',async({page})=>{
 await page.goto('/#/practica/gdp-4');
 await page.locator('[data-theme-toggle]').click();
 const color=await page.evaluate(()=>getComputedStyle(document.querySelector('.lesson-panel')).backgroundColor);
 expect(color).not.toBe('rgb(255, 255, 255)');
 await expect(page.locator('.mission-panel')).toBeVisible();
 await page.setViewportSize({width:390,height:844});
 const width=await page.evaluate(()=>({document:document.documentElement.scrollWidth,viewport:innerWidth}));
 expect(width.document).toBeLessThanOrEqual(width.viewport+1);
});
