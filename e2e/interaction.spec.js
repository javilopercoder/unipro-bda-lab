import {test,expect} from '@playwright/test';
test('planificación Round Robin ejecuta procesos sin bloquearse',async({page})=>{
 await page.goto('/#/practica/so1-1');
 await page.locator('#policy').selectOption('RR');
 await expect(page.locator('.gantt-cell').first()).toBeVisible();
 await expect(page.locator('#lab-output')).toContainText('Espera media');
 await page.locator('#quantum').fill('4');
 await expect(page.locator('.gantt-cell').last()).toBeVisible();
});
test('terminal: crear, escribir, leer, borrar y reiniciar',async({page})=>{
 await page.goto('/#/practica/soa-2');
 const command=async text=>{await page.locator('#command').fill(text);await page.locator('#run').click()};
 await command('mkdir ejercicios');
 await command('touch ejercicios/notas.txt');
 await command('write ejercicios/notas.txt hola-unipro');
 await command('cat ejercicios/notas.txt');
 await expect(page.locator('.terminal-log')).toContainText('hola-unipro');
 await command('cp ejercicios/notas.txt copia.txt');
 await command('rm copia.txt');
 await page.locator('#clear').click();
 await command('ls');
 await expect(page.locator('.terminal-log')).not.toContainText('ejercicios');
});
test('modelos: bisección, datos y hash reaccionan',async({page})=>{
 await page.goto('/#/practica/cmn-2');
 await expect(page.locator('#lab-output')).toContainText('iteraciones: 0');
 await page.locator('#step').click();
 await expect(page.locator('#lab-output')).toContainText('iteraciones: 1');
 await page.goto('/#/practica/bda-2');
 await expect(page.locator('#lab-output')).toContainText('registros');
 await page.locator('#region').selectOption('Centro');
 await expect(page.locator('#lab-output')).toContainText('registros');
 await page.goto('/#/practica/ssi-1');
 await expect(page.locator('#lab-output')).toContainText('SHA-256');
 await page.locator('#message').fill('nuevo-texto');
 await page.locator('#hash').click();
 await expect(page.locator('.hash-result')).toHaveText(/^[0-9a-f]{64}$/);
});
test('clustering permite iterar y añadir puntos',async({page})=>{
 await page.goto('/#/practica/aam-1');
 await expect(page.locator('#lab-output')).toContainText('150 puntos');
 await page.locator('#step').click();
 await expect(page.locator('#lab-output')).toContainText('iteración 1');
 await page.locator('#plot').click({position:{x:140,y:80}});
 await expect(page.locator('#lab-output')).toContainText('151 puntos');
});
