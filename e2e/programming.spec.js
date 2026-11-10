import {test,expect} from '@playwright/test';

test('programación: editor vacío, pistas que completan código y traza real',async({page})=>{
 await page.goto('/#/practica/fpg-1');
 await expect(page.locator('#flow-code')).toHaveValue('');
 await expect(page.locator('#flow-hint')).toBeVisible();
 await page.locator('#next').click();
 await expect(page.locator('#lab-output')).toContainText('Revisa el código');
 await page.locator('#flow-hint').click();
 await expect(page.locator('#flow-hint-result')).toContainText('suma = 0');
 await page.locator('#flow-insert').click();
 await expect(page.locator('#flow-code')).toHaveValue('suma = 0');
 await page.locator('#flow-hint').click();await page.locator('#flow-hint').click();
 await expect(page.locator('#flow-hint-result p')).toHaveCount(3);
 await page.locator('#flow-insert').click();
 await expect(page.locator('#flow-code')).toContainText('for i in range');
 await page.locator('#flow-run').click();
 await expect(page.locator('#lab-output')).toContainText('21');
 await page.locator('[data-range-for="max"]').fill('10');
 await page.locator('#flow-run').click();
 await expect(page.locator('#lab-output')).toContainText('55');
});
test('OOP: código de método editable que modifica los resultados del objeto',async({page})=>{
 await page.goto('/#/practica/pad-1');
 await expect(page.locator('#oop-code')).toHaveValue('');
 await page.locator('#oop-hint').click();
 await expect(page.locator('#oop-hint-result')).toContainText('class Bicicleta');
 await page.locator('#oop-hint').click();await page.locator('#oop-hint').click();
 await page.locator('#oop-insert').click();
 await expect(page.locator('#oop-code')).toContainText('extends Vehiculo');
 await page.locator('#oop-apply').click();
 await expect(page.locator('#lab-output')).toContainText('actualizado');
 await page.locator('#class').selectOption('Bicicleta');
 await page.locator('#instantiate').click();
 await page.locator('#call').click();
 await expect(page.locator('#lab-output')).toContainText('pedalea con energía');
 await expect(page.locator('.object-card')).toContainText('pedalea con energía');
});
test('móvil: editores de código sin desbordamiento y controles legibles',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 for(const lab of ['fpg-1','pad-1']){
  await page.goto('/#/practica/'+lab);
  const field=page.locator(lab==='fpg-1'?'#flow-code':'#oop-code');
  await expect(field).toBeVisible();
  const width=await page.evaluate(()=>({doc:document.documentElement.scrollWidth,inner:innerWidth}));
  expect(width.doc).toBeLessThanOrEqual(width.inner+1);
 }
});
