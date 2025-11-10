import { Page, expect } from '@playwright/test';
import { basketLocators } from '../locators/basket.locators';
import { BasePage } from './base.page';

export class BasketPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async waitForCartDropdownVisible() {
    const dropdown = this.page.locator(basketLocators.basketDropdownMenu);
    const isVisible = await dropdown.isVisible({ timeout: 3000 }).catch(() => false);
    expect.soft(isVisible).toBeTruthy();
    if (isVisible) {
      await this.waitForDisplayed(basketLocators.basketDropdownMenu);
    }
  }

  async verifyDeleteIconVisible() {
    await this.waitForDisplayed(basketLocators.deleteProductIconDropdownMenu);
  }

  async clickNavBar() {
    await this.page.locator(basketLocators.navBar).click();
  }

  async verifyItemPosterVisible() {
    await this.waitForDisplayed(basketLocators.basketItemPosterDropdownMenu);
  }

  async verifyItemTitle(expectedTitles: string[]) {
    const titleElements = this.page.locator(basketLocators.basketItemTitleDropdownMenu);
    const actualCount = await titleElements.count();
    const actualTitles: string[] = [];

    for (let i = 0; i < actualCount; i++) {
      const title = await titleElements.nth(i).textContent();
      if (title) actualTitles.push(title.trim());
    }

    for (const expectedTitle of expectedTitles) {
      expect.soft(actualTitles).toContain(expectedTitle);
    }
  }

  async verifyItemPrice(expectedPrices: string[]) {
    for (let i = 0; i < expectedPrices.length; i++) {
      const locator = basketLocators.basketItemPriceDropdownMenu(i + 1);
      await this.waitForDisplayed(locator);
      const price = await this.getText(locator);
      expect.soft(price).toBe(expectedPrices[i]);
    }
  }

  async verifyItemCount(expectedCounts: string[]) {
    for (let i = 0; i < expectedCounts.length; i++) {
      const locator = basketLocators.basketCountIconDropdownMenu(i + 1);
      await this.waitForDisplayed(locator);
      const count = await this.getText(locator);
      expect.soft(count).toBe(expectedCounts[i]);
    }
  }

  async verifyCartTotal(expectedText: string, expectedAmount: string) {
    await this.waitForDisplayed(basketLocators.basketFullPriceText);
    const fullText = await this.getText(basketLocators.basketFullPriceText);
    expect.soft(fullText).toContain(expectedText);

    await this.waitForDisplayed(basketLocators.basketFullPrice);
    const total = await this.getText(basketLocators.basketFullPrice);
    expect.soft(total).toBe(expectedAmount);
  }

  async verifyGoToCartButtonVisible() {
    await this.waitForDisplayed(basketLocators.goToCartButton);
  }

  async getCartTotalValue(): Promise<string> {
    const totalText = await this.page.locator(basketLocators.basketFullPrice).innerText();
    return totalText.replace(/[^\d]/g, '');
  }

  async verifyClearCartButtonVisible() {
    await this.waitForDisplayed(basketLocators.clearBasketButton);
  }

  async clickGoToCartButton() {
    await this.page.locator(basketLocators.goToCartButton).click();
  }

  async clickClearBasketButton() {
    await this.page.locator(basketLocators.clearBasketButton).click();
  }

  async checkBasketServerError() {
    await this.page.waitForLoadState('domcontentloaded');
    const headerText = await this.page.locator('h1').textContent().catch(() => '');
    const alertText = await this.page.locator('div.alert.alert-danger').textContent().catch(() => '');
    const isHeaderCorrect = headerText?.includes('Server Error (#500)');
    const isAlertCorrect =
      alertText?.toLowerCase().includes('internal server error') ||
      alertText?.toLowerCase().includes('ошибка') ||
      alertText?.toLowerCase().includes('произошла ошибка');
    let response500Caught = false;
    this.page.on('response', (response) => {
      if (response.url().includes('/basket') && response.status() === 500) {
        response500Caught = true;
      }
    });
    expect.soft(isHeaderCorrect || isAlertCorrect || response500Caught).toBeFalsy();
  }
}
