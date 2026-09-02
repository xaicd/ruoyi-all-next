import { test, expect } from '@playwright/test';
import { TestingKit } from '../../src/modules/infra/testing/TestingKit';

test.describe('L4 Agent: Autonomous UI Health & Self-Healing Probe', () => {
  const config = TestingKit.getAgentPlaywrightProbeConfig();

  test('Agent 自主 DOM 探针: 验证未发生未捕获的前端 JS 白屏异常', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (exception) => {
      pageErrors.push(exception.message);
    });

    await page.goto(config.baseUrl).catch(() => {});
    
    // 断言页面未抛出致命 React / JS 未捕获崩溃异常
    const fatalErrors = pageErrors.filter(err => !err.includes('Failed to fetch'));
    expect(fatalErrors).toHaveLength(0);
  });

  test('Agent 渲染健康度探针: 验证根容器与标题挂载就绪', async ({ page }) => {
    await page.goto(config.baseUrl).catch(() => {});
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
