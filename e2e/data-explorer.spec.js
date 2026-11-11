import {test,expect} from '@playwright/test';

test('Explorador: catálogo real, metadatos, tamaños y vistas previas',async({page})=>{
 await page.goto('/bda.html#data');
 await expect(page.locator('h1').filter({hasText:'Explorador de datos'})).toBeVisible();
 await expect(page.locator('#data-explorer')).toContainText('clientes',{timeout:60000});
 await expect(page.locator('#data-explorer')).toContainText('pedidos');
 await expect(page.locator('#data-explorer')).toContainText('dim_producto');
 await expect(page.locator('#data-explorer')).toContainText('fact_ventas');
 await expect(page.locator('#data-explorer')).toContainText('correo');
 await expect(page.locator('#data-explorer')).toContainText('Registros');
 await page.getByText('Ver columnas y tipos').first().click();
 await expect(page.locator('#data-explorer')).toContainText('fecha_alta');
 await page.getByText('Vista previa de datos').first().click();
 await expect(page.locator('.data-preview-content').first()).toContainText('Ana');
});
test('SQL: tabla completa, exportación y catálogo accesible desde el editor',async({page})=>{
 await page.goto('/bda.html#sql');
 await page.locator('#code').fill('SELECT c.*,p.* FROM clientes c JOIN pedidos p ON p.cliente_id=c.id LIMIT 3');
 await page.getByRole('button',{name:'▶ Ejecutar'}).click();
 await expect(page.locator('#state')).toContainText('Consulta ejecutada',{timeout:60000});
 await expect(page.locator('#results th').filter({hasText:'id'})).toHaveCount(3);
 await expect(page.getByRole('button',{name:'↓ CSV'})).toBeEnabled();
 await page.getByRole('button',{name:'▤ Ver tablas, columnas y tamaños'}).click();
 await expect(page.locator('#data-explorer')).toContainText('Última consulta',{timeout:60000});
 await expect(page.locator('#data-explorer')).toContainText('SELECT c.*,p.*');
});
test('Documentos: esquema y datos de prueba variados',async({page})=>{
 await page.goto('/bda.html#data');
 await page.locator('#data-mode').selectOption('mongo');
 await expect(page.locator('#data-explorer')).toContainText('2.505',{timeout:60000});
 await expect(page.locator('#data-explorer')).toContainText('simulador');
 await page.getByText('Ver columnas y tipos').first().click();
 await expect(page.locator('#data-explorer')).toContainText('segmento');
});
