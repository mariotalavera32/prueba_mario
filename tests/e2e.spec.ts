import { test, expect } from '@playwright/test';

test('agrega y completa una tarea', async ({ page }) => {
  await page.goto('./');
  await page.getByPlaceholder('What needs to be done?').fill('Aprender QA');
  await page.keyboard.press('Enter');

  const item = page.getByTestId('todo-item');
  await expect(item).toHaveCount(1);

  await item.getByRole('checkbox').check();
  await expect(item).toHaveClass(/completed/);
});
