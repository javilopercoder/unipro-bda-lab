import {test,expect} from '@playwright/test';

test('terminal: se escribe dentro de la consola y permite explorar sin ejercicios',async({page})=>{
 await page.goto('/#/practica/soa-2');
 const prompt=page.locator('.terminal-input-line #command');
 await expect(prompt).toBeVisible();
 await expect(prompt).toHaveValue('');
 await expect(page.locator('#term-mission')).toHaveValue('0');
 await prompt.fill('pwd');await prompt.press('Enter');
 await expect(page.locator('.terminal-log')).toContainText('/home/alumno');
 await prompt.fill('mkdir proyectos');await prompt.press('Enter');
 await prompt.fill('touch proyectos/notas.txt');await prompt.press('Enter');
 await prompt.fill('echo hola > proyectos/notas.txt');await prompt.press('Enter');
 await prompt.fill('cat proyectos/notas.txt');await prompt.press('Enter');
 await expect(page.locator('.terminal-log')).toContainText('hola');
 await prompt.press('ArrowUp');
 await expect(prompt).toHaveValue('cat proyectos/notas.txt');
 await prompt.fill('hel');await prompt.press('Tab');
 await expect(prompt).toHaveValue('help ');
 await prompt.press('Enter');
 await expect(page.locator('.terminal-log')).toContainText('Comandos:');
});
test('pistas terminal: revelan partes y no ejecutan nada por sí mismas',async({page})=>{
 await page.goto('/#/practica/soa-2');
 await page.locator('#term-mission').selectOption('1');
 await expect(page.locator('#term-goal')).toContainText('proyectos');
 await page.locator('#term-hint').click();
 await expect(page.locator('#term-hint-result p')).toHaveCount(1);
 await expect(page.locator('#term-hint-result')).toContainText('mkdir');
 await page.locator('#term-hint').click();
 await expect(page.locator('#term-hint-result')).toContainText('mkdir proyectos');
 await page.locator('#term-paste').click();
 await expect(page.locator('#command')).toHaveValue('mkdir proyectos');
 await expect(page.locator('.terminal-log')).not.toContainText('Creado: proyectos');
 await page.locator('#command').press('Enter');
 await expect(page.locator('.terminal-log')).toContainText('Creado: proyectos');
});
test('SQL: editor vacío, pistas parciales y Ctrl+Enter',async({page})=>{
 await page.goto('/bda.html#sql');
 await expect(page.locator('#code')).toHaveValue('');
 await expect(page.locator('#results')).toContainText('Escribe una consulta');
 await page.locator('#coach-next').click();
 await expect(page.locator('#coach-stages .coach-step')).toHaveCount(1);
 await page.locator('#coach-next').click();
 await expect(page.locator('#coach-stages .coach-step')).toHaveCount(2);
 await expect(page.locator('#coach-insert')).toBeVisible();
 await page.locator('#coach-insert').click();
 await expect(page.locator('#code')).not.toHaveValue('');
 await page.locator('#code').fill("SELECT nombre, ciudad FROM clientes WHERE ciudad = 'Madrid';");
 await page.locator('#code').press('Control+Enter');
 await expect(page.locator('#state')).toContainText('Consulta ejecutada',{timeout:60000});
 await expect(page.locator('#results tbody tr')).toHaveCount(100,{timeout:60000});
 await page.getByRole('button',{name:'✦ Explorar sin reto'}).click();
 await expect(page.locator('#code')).toHaveValue('');
 await page.locator('#code').fill('SELECT COUNT(*) AS total FROM clientes');
 await page.getByRole('button',{name:'▶ Ejecutar'}).click();
 await expect(page.locator('#results')).toContainText('1205');
});
test('MongoDB y XPath: consultas propias y ayuda sin rellenar',async({page})=>{
 await page.goto('/bda.html#mongo');
 await expect(page.locator('#code')).toHaveValue('');
 await page.locator('#coach-next').click();
 await expect(page.locator('#code')).toHaveValue('');
 await page.locator('#code').fill('db.clientes.find({"ciudad":"Madrid"})');
 await page.getByRole('button',{name:'▶ Ejecutar'}).click();
 await expect(page.locator('#state')).toContainText('Consulta ejecutada');
 await page.goto('/bda.html#xml');
 await expect(page.locator('#code')).toHaveValue('');
 await page.locator('#code').fill('//nombre/text()');
 await page.getByRole('button',{name:'▶ Ejecutar'}).click();
 await expect(page.locator('#results tbody tr')).toHaveCount(3);
});
test('Redis: escribir en la misma consola, historial y pistas progresivas',async({page})=>{
 await page.goto('/bda.html#redis');
 await expect(page.locator('.redis-command-row #code')).toBeVisible();
 await expect(page.locator('#code')).toHaveValue('');
 await page.locator('#code').fill('HELP');await page.locator('#code').press('Enter');
 await expect(page.locator('#results')).toContainText('Comandos disponibles');
 await page.locator('#code').fill('SET curso informática');await page.locator('#code').press('Enter');
 await page.locator('#code').fill('GET curso');await page.locator('#code').press('Enter');
 await expect(page.locator('#results')).toContainText('informática');
 await page.locator('#code').press('ArrowUp');
 await expect(page.locator('#code')).toHaveValue('GET curso');
 await page.locator('#redis-mission').selectOption('3');
 await page.locator('#coach-next').click();await page.locator('#coach-next').click();
 await expect(page.locator('#coach-stages')).toContainText('INCR');
});
test('deslizadores: escritura manual y arrastre se sincronizan',async({page})=>{
 await page.goto('/#/practica/ffi-1');
 const range=page.locator('#V'),typed=page.locator('[data-range-for="V"]');
 await expect(typed).toHaveValue('12');
 await typed.fill('24');
 await expect(range).toHaveValue('24');
 await expect(page.locator('#lab-output')).toContainText('24');
 await range.evaluate(el=>{el.value='18';el.dispatchEvent(new Event('input',{bubbles:true}))});
 await expect(typed).toHaveValue('18');
 await page.goto('/#/practica/so1-1');
 await expect(page.locator('[data-range-for="quantum"]')).toBeVisible();
 await page.locator('[data-range-for="quantum"]').fill('4');
 await expect(page.locator('#quantum')).toHaveValue('4');
});
test('interfaces en móvil sin desbordamiento',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 for(const url of ['/#/practica/soa-2','/#/practica/ffi-1','/bda.html#sql','/bda.html#mongo','/bda.html#redis']){
  await page.goto(url);
  const widths=await page.evaluate(()=>({doc:document.documentElement.scrollWidth,viewport:innerWidth}));
  expect(widths.doc,url).toBeLessThanOrEqual(widths.viewport+1);
 }
});
