import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: /.*\.spec\.ts/,
  retries: process.env.CI ? 2 : 0,
  snapshotPathTemplate: '{testDir}/__snapshots__/{testFileName}/{arg}{ext}',
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.02 } },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'https://demo.playwright.dev/todomvc/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npx tsx scripts/test-server.ts',
    url: 'http://localhost:3100/health',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: 'chromium', testIgnore: /backend\//, use: { browserName: 'chromium' } },
    { name: 'firefox', testIgnore: /backend\//, use: { browserName: 'firefox' } },
    { name: 'webkit', testIgnore: /backend\//, use: { browserName: 'webkit' } },
    { name: 'backend', testMatch: /backend\/.*\.spec\.ts/, use: { baseURL: 'http://localhost:3100' } },
  ],
});
