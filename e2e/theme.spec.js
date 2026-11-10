import {test,expect} from '@playwright/test';

test('tema claro/oscuro persiste entre campus y BDA',async({page})=>{
 await page.goto('/');
 const toggle=page.locator('[data-theme-toggle]');
 await expect(toggle).toHaveAttribute('aria-label','Cambiar a modo oscuro');
 await toggle.click();
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await expect(toggle).toHaveAttribute('aria-pressed','true');
 await page.reload();
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await page.goto('/bda.html');
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await page.locator('[data-theme-toggle]').click();
 await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 await page.goto('/');
 await expect(page.locator('html')).toHaveAttribute('data-theme','light');
});
test('modo oscuro muestra superficies oscuras reales',async({page})=>{
 await page.goto('/');
 await page.locator('[data-theme-toggle]').click();
 const colors=await page.evaluate(()=>({
  body:getComputedStyle(document.body).backgroundColor,
  aside:getComputedStyle(document.querySelector('.app-aside')).backgroundColor,
  card:getComputedStyle(document.querySelector('.subject-card')).backgroundColor,
 }));
 expect(colors.body).not.toBe('rgb(245, 247, 252)');
 expect(colors.aside).not.toBe('rgb(255, 255, 255)');
 expect(colors.card).not.toBe('rgb(255, 255, 255)');
});
