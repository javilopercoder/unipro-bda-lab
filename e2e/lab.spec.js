import {test,expect} from '@playwright/test';
test('inicio y PostgreSQL en navegador',async({page})=>{
 await page.goto('/bda.html');
 await expect(page.getByRole('heading',{name:'SQL y PostgreSQL'})).toBeVisible();
 await expect(page.locator('#code')).toBeEmpty();
 await page.locator('#code').fill("SELECT nombre, ciudad FROM clientes WHERE ciudad = 'Madrid';");
 await page.getByRole('button',{name:'▶ Ejecutar'}).click();
 await expect(page.locator('#results tbody tr')).toHaveCount(100,{timeout:60000});
 await page.getByRole('button',{name:'✓ Comprobar'}).click();
 await expect(page.locator('#state')).toContainText('Resultado correcto');
});
test('MongoDB, XML y Redis responden',async({page})=>{
 await page.goto('/bda.html');
 await page.getByRole('button',{name:/Documentos \/ MongoDB/}).click();
 await expect(page.locator('#code')).toBeEmpty();
 await page.locator('#code').fill('db.clientes.find({"ciudad":"Madrid"})');
 await page.getByRole('button',{name:'▶ Ejecutar'}).click();
 await expect(page.locator('#results tbody tr')).toHaveCount(100);
 await page.getByRole('button',{name:/XML y XPath/}).click();
 await expect(page.locator('#code')).toBeEmpty();
 await page.locator('#code').fill('//nombre/text()');
 await page.getByRole('button',{name:'▶ Ejecutar'}).click();
 await expect(page.locator('#results tbody tr')).toHaveCount(3);
 await page.getByRole('button',{name:/Redis \/ clave-valor/}).click();
 await expect(page.locator('#code')).toBeEmpty();
 await page.locator('#code').fill('SET alumno Ana');
 await page.getByRole('button',{name:/Ejecutar ↵/}).click();
 await expect(page.locator('#results')).toContainText('OK');
});
test('transacciones y OLAP',async({page})=>{
 await page.goto('/bda.html');
 await page.getByRole('button',{name:/Transacciones/}).click();
 await page.getByRole('button',{name:'BEGIN'}).click();
 await page.getByRole('button',{name:'TRANSFERIR 100 €'}).click();
 await expect(page.locator('#history')).toContainText('TRANSFER');
 await page.getByRole('button',{name:'COMMIT'}).click();
 await expect(page.locator('#balances')).toContainText('900 €');
 await page.getByRole('button',{name:/OLAP y minería/}).click();
 await expect(page.locator('#olap-table tbody tr')).toHaveCount(4);
});
test('pantalla móvil sin desbordamiento horizontal',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/bda.html');
 await expect(page.getByRole('heading',{name:'SQL y PostgreSQL'})).toBeVisible();
 const width=await page.evaluate(()=>({body:document.documentElement.scrollWidth,viewport:innerWidth}));
 expect(width.body).toBeLessThanOrEqual(width.viewport+1);
});
