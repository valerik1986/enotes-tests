import { expect } from '@playwright/test';
import type { TestInfo, Page } from '@playwright/test';

export async function safeExpect(
  received: any,
  expected: any,
  testInfo: TestInfo,
  page: Page,
  label: string
) {
  try {
    expect(received).toBe(expected);
  } catch (error) {
    console.error(`❌ ${label}:`, error);

    const screenshotPath = `screenshots/error_${label.replace(/\s+/g, '_')}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });

    testInfo.attachments.push({
      name: `BUG: ${label}`,
      contentType: 'text/plain',
      body: Buffer.from((error as Error).message)
    });

    testInfo.attachments.push({
      name: `Screenshot: ${label}`,
      path: screenshotPath,
      contentType: 'image/png'
    });
  }
}