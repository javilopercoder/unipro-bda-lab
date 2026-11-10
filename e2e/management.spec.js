import {test,expect} from '@playwright/test';
const navigate=async(page,code)=>{await page.goto('/#/practica/'+code);await expect(page.locator('#lab-root')).toBeVisible();await expect(page.locator('#mg-out')).toBeVisible()};
test('30 asignaturas salvo TFG y enlaces de los códigos de Google Sheets',async({page})=>{
 await page.goto('/');
 await expect(page.locator('.subject-card')).toHaveCount(30);
 for(const [external,name] of [['FPR','Fundamentos de programación'],['AYC','Algoritmia y complejidad'],['EDD','Estructura de datos'],['PRA','Programación avanzada'],['EDC','Estructura de computadores'],['IGV','Informática gráfica y visualización'],['AMD2','Aprendizaje automático y minería de datos']]){
  await page.goto('/#/asignatura/'+external);
  await expect(page.locator('.subject-hero h1')).toHaveText(name);
  await expect(page.locator('.lab-card').first()).toBeVisible();
 }
 await page.goto('/#/asignatura/TFB');
 await expect(page.locator('#content-inner')).toContainText('Asignatura desconocida');
});
test('Gestión de proyectos: CPM, valor ganado y riesgos interactivos',async({page})=>{
 await navigate(page,'gdp-1');
 await expect(page.locator('#mg-out')).toContainText('Duración mínima');
 const first=await page.locator('#mg-out').textContent();
 await page.locator('.plan-days[data-id="D"]').fill('15');
 await page.locator('.plan-days[data-id="D"]').press('Tab');
 await expect.poll(async()=>page.locator('#mg-out').textContent()).not.toBe(first);
 await navigate(page,'gdp-2');
 await expect(page.locator('#mg-out')).toContainText('CPI');
 await page.locator('#complete').evaluate(el=>{el.value='80';el.dispatchEvent(new Event('input',{bubbles:true}))});
 await expect(page.locator('#mg-out')).toContainText('EV (ganado): 48.000');
 await navigate(page,'gdp-3');await expect(page.locator('#mg-out')).toContainText('P90');
});
test('Empresa: ingresos, punto muerto, caja y VAN calculados',async({page})=>{
 await navigate(page,'fem-1');await expect(page.locator('#mg-out')).toContainText('Punto muerto');
 await page.locator('#price').evaluate(el=>{el.value='15';el.dispatchEvent(new Event('input',{bubbles:true}))});
 await expect(page.locator('#mg-out')).toContainText('margen unitario');
 await navigate(page,'fem-2');await expect(page.locator('#mg-viz tbody tr')).toHaveCount(12);
 await navigate(page,'fem-3');await expect(page.locator('#mg-out')).toContainText('VAN');
});
test('Deontología: privacidad, licencias e incidentes son simulaciones, no test',async({page})=>{
 await navigate(page,'dyl-1');
 await expect(page.locator('#mg-out')).toContainText('señales para revisar');
 await page.locator('#encrypt').check();await expect(page.locator('#mg-out')).toBeVisible();
 await navigate(page,'dyl-2');
 await page.locator('#dep').selectOption('gpl');
 await expect(page.locator('#mg-viz')).toContainText('GPL-3.0');
 await navigate(page,'dyl-3');await page.locator('#hours').evaluate(el=>{el.value='80';el.dispatchEvent(new Event('input',{bubbles:true}))});
 await expect(page.locator('#mg-viz')).toContainText('72 horas');
});
test('Comunicación: canal, equipo y reuniones recalculan',async({page})=>{
 await navigate(page,'cyl-1');await expect(page.locator('#mg-out')).toContainText('Canal sugerido');
 await navigate(page,'cyl-2');await expect(page.locator('#mg-out')).toContainText('Índice de coordinación');
 await navigate(page,'cyl-3');
 await expect(page.locator('#mg-out')).toContainText('minutos');
 await page.locator('#duration').evaluate(el=>{el.value='30';el.dispatchEvent(new Event('input',{bubbles:true}))});
 await expect(page.locator('#mg-out')).toContainText('pasado');
});
