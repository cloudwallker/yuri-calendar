import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './e2e', fullyParallel: true, workers: 2, reporter: 'list',
  use: { baseURL: process.env.TEST_BASE_URL || 'http://127.0.0.1:4173', channel: 'chrome', headless: true, reducedMotion: 'reduce', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  webServer: process.env.TEST_BASE_URL ? undefined : { command: 'node scripts/serve.mjs', url: 'http://127.0.0.1:4173', reuseExistingServer: true },
});
