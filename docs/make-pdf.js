const { chromium } = require('@playwright/test');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file:///' + path.join(__dirname, 'documentacion.html').replace(/\\/g, '/'));
  await page.pdf({ path: path.join(__dirname, 'documentacion.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
  await browser.close();
})();
