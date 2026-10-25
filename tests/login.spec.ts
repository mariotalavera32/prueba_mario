import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login', () => {
  let login: LoginPage;

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
    await login.goto();
  });

  test('login válido accede a la zona segura', async ({ page }) => {
    await login.login('tomsmith', 'SuperSecretPassword!');
    await expect(page).toHaveURL(/\/secure$/);
    await login.expectMessage('You logged into a secure area!');
  });

  const invalid = [
    { caso: 'contraseña incorrecta', user: 'tomsmith', pass: 'incorrecta', msg: 'Your password is invalid!' },
    { caso: 'usuario inexistente', user: 'nadie', pass: 'x', msg: 'Your username is invalid!' },
    { caso: 'campos vacíos', user: '', pass: '', msg: 'Your username is invalid!' },
    { caso: 'usuario con distinto case', user: 'TomSmith', pass: 'SuperSecretPassword!', msg: 'Your username is invalid!' },
  ];

  for (const { caso, user, pass, msg } of invalid) {
    test(`${caso} muestra error`, async ({ page }) => {
      await login.login(user, pass);
      await expect(page).toHaveURL(/\/login$/);
      await login.expectMessage(msg);
    });
  }

  test('logout vuelve al login', async ({ page }) => {
    await login.login('tomsmith', 'SuperSecretPassword!');
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page).toHaveURL(/\/login$/);
    await login.expectMessage('You logged out of the secure area!');
  });
});
