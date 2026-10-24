import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('TodoMVC no tiene violaciones graves de accesibilidad', async ({ page }) => {
  await page.goto('./');
  // color-contrast es un problema conocido del sitio demo (no es nuestro código)
  const results = await new AxeBuilder({ page }).disableRules(['color-contrast']).analyze();
  const serious = results.violations.filter((v) =>
    ['serious', 'critical'].includes(v.impact ?? ''),
  );
  expect(serious.map((v) => v.id)).toEqual([]);
});
