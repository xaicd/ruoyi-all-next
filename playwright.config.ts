import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E & Agent 自动化测试配置
 */
export default defineConfig({
  testDir: './test',
  testMatch: ['**/*.spec.ts', '**/*.e2e.ts'],
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: process.env.START_WEB_SERVER
    ? {
        command: 'pnpm dev',
        url: 'http://localhost:3200',
        reuseExistingServer: !process.env.CI,
        timeout: 120000
      }
    : undefined
});
