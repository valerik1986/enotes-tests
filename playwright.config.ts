import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const selectedBrowser = process.env.BROWSER || 'chromium';

const availableProjects = {
  chromium: { name: 'chromium', use: { ...devices['Desktop Chrome'], headless: false } },
  firefox: { name: 'firefox', use: { ...devices['Desktop Firefox'], headless: false } },
  webkit: { name: 'webkit', use: { ...devices['Desktop Safari'], headless: false } },
};

export default defineConfig({
  testDir: './e2e/tests',
  timeout: 30000,

  reporter: [
    ['list'],
    ['allure-playwright', { outputFolder: 'allure-results', detail: true, suiteTitle: false }]
  ],

  use: {
    baseURL: process.env.BASE_URL || 'https://enotes.pointschool.ru',
    ignoreHTTPSErrors: true,
    viewport: { width: 1280, height: 720 },
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },

  projects: [availableProjects[selectedBrowser]],
});
