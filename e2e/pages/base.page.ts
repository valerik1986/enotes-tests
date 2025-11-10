import { Page, expect } from '@playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForDisplayed(selector: string, timeout = 5000) {
    await this.page.locator(selector).waitFor({ state: 'visible', timeout });
  }

  async getElement(selector: string) {
    return this.page.locator(selector);
  }

  async getAttrValue(selector: string, attribute: string) {
    return this.page.locator(selector).getAttribute(attribute);
  }

  async getListOfElements(selector: string) {
    return this.page.locator(selector).all();
  }

  async getText(selector: string): Promise<string> {
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'visible' });
    return locator.innerText();
  }
}
