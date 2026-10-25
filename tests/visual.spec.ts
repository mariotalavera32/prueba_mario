import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';

test.describe('Regresión visual', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'Baselines solo para Chromium');

  test('lista con tareas', async ({ page }) => {
    const todo = new TodoPage(page);
    await todo.goto();
    await todo.add('Comprar leche', 'Escribir tests');
    await todo.toggle('Escribir tests');
    await expect(page.locator('.todoapp')).toHaveScreenshot('lista-con-tareas.png');
  });

  test('estado vacío', async ({ page }) => {
    await page.goto('./');
    await expect(page.locator('.todoapp')).toHaveScreenshot('estado-vacio.png');
  });
});
