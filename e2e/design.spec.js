import {test,expect} from '@playwright/test';

test('sin identidad ni enlaces institucionales en portada, materias y BDA',async({page})=>{
 await page.goto('/');
 await expect(page.locator('.identity')).toContainText('Laboratorio');
 await expect(page.locator('body')).not.toContainText(/unipro|consultar referencia|sobre las fuentes|universidadunipro/i);
 await expect(page.locator('a[href*="unipro"]')).toHaveCount(0);
 for(const code of ['AMD','FFI','BDA','GDP','DYL']){
  await page.goto('/#/asignatura/'+code);
  await expect(page.locator('.subject-hero')).toBeVisible();
  await expect(page.locator('.source-box')).toHaveCount(0);
  await expect(page.locator('a[href*="unipro"]')).toHaveCount(0);
 }
 await page.goto('/bda.html#sql');
 await expect(page.locator('.brand')).toContainText('Laboratorio');
 await expect(page.locator('a[href*="unipro"]')).toHaveCount(0);
 await expect(page.locator('a.back-to-campus')).toHaveAttribute('href','./index.html#/asignatura/BDA');
});
test('Sarrus visual: ejemplo, diagonal, resultado y matriz sin inversa',async({page})=>{
 await page.goto('/#/practica/amd-1');
 await expect(page.locator('.lesson-matrix-values span')).toHaveCount(9);
 await expect(page.locator('.matrix-grid input')).toHaveCount(9);
 await expect(page.locator('#mx-determinant')).toHaveText('13');
 await expect(page.locator('#mx-counter')).toHaveText('1 de 6');
 await expect(page.locator('.mx-svg-active')).toHaveCount(3);
 await page.locator('#mx-next').click();
 await expect(page.locator('#mx-counter')).toHaveText('2 de 6');
 await expect(page.locator('#mx-multiply')).toContainText('12');
 for(let i=0;i<4;i++)await page.locator('#mx-next').click();
 await expect(page.locator('#mx-direction')).toContainText('Rest');
 await expect(page.locator('#mx-counter')).toHaveText('6 de 6');
 await page.locator('[data-preset=identity]').click();
 await expect(page.locator('#mx-determinant')).toHaveText('1');
 await page.locator('[data-preset=singular]').click();
 await expect(page.locator('#mx-determinant')).toHaveText('0');
 await expect(page.locator('.mx-result-status')).toContainText('Sin inversa');
 await page.locator('[data-preset=example]').click();
 await page.locator('#m0').fill('9');
 await expect(page.locator('#mx-determinant')).toHaveText('21');
 await page.locator('#mission-check').click();
 await expect(page.locator('#mission-feedback')).toContainText('Misión realizada');
});
test('el ejemplo muestra un paso cada vez y la misión sigue visible',async({page})=>{
 await page.goto('/#/practica/rdo-1');
 await expect(page.locator('.lesson-example li')).toHaveCount(3);
 await expect(page.locator('.lesson-example li.is-current')).toHaveCount(1);
 await page.locator('#example-next').click();
 await expect(page.locator('#example-progress')).toHaveText('2 / 3');
 await expect(page.locator('.lesson-example li.is-current')).toHaveCount(1);
 await page.locator('#example-next').click();
 await expect(page.locator('#example-progress')).toHaveText('3 / 3');
 await expect(page.locator('.mission-panel')).toBeVisible();
 await page.locator('#mission-hint').click();
 await expect(page.locator('#mission-hints p')).toHaveCount(1);
});
test('en móvil la lección, la misión y la matriz no desbordan',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/#/practica/amd-1');
 await expect(page.locator('.mx-diagram svg')).toBeVisible();
 await expect(page.locator('.lesson-panel')).toBeVisible();
 await expect(page.locator('.mission-panel')).toBeVisible();
 const widths=await page.evaluate(()=>({page:document.documentElement.scrollWidth,screen:window.innerWidth}));
 expect(widths.page).toBeLessThanOrEqual(widths.screen+1);
});
