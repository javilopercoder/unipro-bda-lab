import {test,expect} from '@playwright/test';
test('portada con 26 asignaturas y acceso BDA',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 await expect(page.getByRole('heading',{name:/Aprende haciendo/})).toBeVisible();
 await expect(page.locator('.subject-card')).toHaveCount(26);
 await page.locator('a[href="#/asignatura/BDA"]').first().click();
 await expect(page.getByRole('heading',{name:'Bases de datos avanzadas'})).toBeVisible();
 await page.locator('a[href="#/practica/bda-1"]').click();
 await expect(page.getByRole('link',{name:/Abrir el laboratorio original/})).toBeVisible();
 expect(errors).toEqual([]);
});
test('cada laboratorio técnico abre sin error y responde',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 const all=await page.evaluate(async()=>{const m=await import('/src/campus/catalog.js');return m.SUBJECTS.flatMap(s=>s.labs.filter(l=>l.type!=='bda').map(l=>l.id))});
 for(const id of all){
   await page.goto('/#/practica/'+id);
   await expect(page.locator('#lab-root')).toBeVisible();
   await expect(page.locator('#lab-root')).not.toContainText('No se pudo abrir el laboratorio');
   await expect(page.locator('#lab-root')).not.toContainText('Motor pendiente');
 }
 expect(errors).toEqual([]);
});
test('matrices responden a edición y el progreso queda guardado',async({page})=>{
 await page.goto('/#/practica/amd-1');
 await expect(page.locator('.matrix-grid input')).toHaveCount(9);
 const result=page.locator('#lab-output');
 await expect(result).toContainText('Determinante');
 await page.locator('#m0').fill('9');
 await expect(page.locator('[data-progress="amd-1"]')).toContainText('Practicado');
 await page.reload();
 await expect(page.locator('[data-progress="amd-1"]')).toContainText('Practicado');
});
test('pantalla pequeña sin desplazamiento horizontal',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/');
 await expect(page.getByRole('heading',{name:/Aprende haciendo/})).toBeVisible();
 const dims=await page.evaluate(()=>({body:document.documentElement.scrollWidth,screen:innerWidth}));
 expect(dims.body).toBeLessThanOrEqual(dims.screen+1);
});
