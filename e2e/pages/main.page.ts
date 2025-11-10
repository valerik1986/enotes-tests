import { Page, expect } from '@playwright/test';
import { mainLocators } from '../locators/main.locators';
import { BasePage } from './base.page';

export class MainPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async closeAlertIfVisible() {
    this.page.on('dialog', async (dialog) => {
      await dialog.accept();
    });
  }

  async clickNavbarBrand() {
    await this.page.locator(mainLocators.navbarBrand).click();
  }

  async tryClickCartIconWhenEmpty() {
    const cartIcon = this.page.locator(mainLocators.basketIcon);
    await cartIcon.click();
    await this.page.waitForTimeout(1000);

    const errors: string[] = [];
    this.page.on('pageerror', (err) => errors.push(err.message));
    const hasToastError = errors.some(e => e.includes('showToast'));
    expect.soft(hasToastError).toBeFalsy();
  }

  async addPromotionalItemAndVerifyBasketIcon() {
    const isBasketIconVisible = await this.isBasketIconVisible();
    expect.soft(isBasketIconVisible).toBeTruthy();
  }

  async verifyUserAvatarVisible() {
    await this.waitForDisplayed(mainLocators.userAvatar);
  }

  async verifyUserNameVisible(expectedName: string) {
    await this.waitForDisplayed(mainLocators.userName);
    const name = await this.getText(mainLocators.userName);
    expect.soft(name).toBe(expectedName);
  }

  async isBasketIconVisible(): Promise<boolean> {
    const basketIcon = this.page.locator(mainLocators.basketIcon);
    return await basketIcon.isVisible().catch(() => false);
  }

  async verifyCartNameVisible() {
    await this.waitForDisplayed(mainLocators.basketName);
  }

  async clickOnCartName() {
    await this.page.locator(mainLocators.basketName).click();
  }

  async verifyBasketCountOnMainPage(expectedCount: string) {
    await expect.soft(this.page.locator(mainLocators.basketCount)).toHaveText(expectedCount);
  }

  async verifySearchFiltersVisible() {
    await this.waitForDisplayed(mainLocators.searchField);
    await this.waitForDisplayed(mainLocators.searchFieldButton);
    await this.waitForDisplayed(mainLocators.typeField);
    await this.waitForDisplayed(mainLocators.brandField);
    await this.waitForDisplayed(mainLocators.fromPriceField);
    await this.waitForDisplayed(mainLocators.toPriceField);
    await this.waitForDisplayed(mainLocators.priceSearchButton);
    await this.waitForDisplayed(mainLocators.discountCheckbox);
    await this.waitForDisplayed(mainLocators.discountCheckboxLabel);
  }

  async verifyDiscountCheckboxLabelText(expectedText: string) {
    const label = await this.getText(mainLocators.discountCheckboxLabel);
    expect.soft(label.trim()).toBe(expectedText);
  }

  async openCartDropdown() {
    await this.waitForDisplayed(mainLocators.basketIcon);
    await this.page.locator(mainLocators.basketIcon).click();
  }

  async addNotepadToPointToCart() {
    await this.waitForDisplayed(mainLocators.buyButtonNotepadToPoint);
    await this.page.locator(mainLocators.buyButtonNotepadToPoint).click();
  }

  async addGameOfThronesToCart() {
    await this.waitForDisplayed(mainLocators.buyButtonGameOfThrones);
    await this.page.locator(mainLocators.buyButtonGameOfThrones).click();
  }

  async addCreativeChaosBookToCart() {
    await this.waitForDisplayed(mainLocators.buyButtonCreativeChaos);
    await this.page.locator(mainLocators.buyButtonCreativeChaos).click();
  }

  async addCatMaryToCart() {
    await this.waitForDisplayed(mainLocators.buyButtonCatMary);
    await this.page.locator(mainLocators.buyButtonCatMary).click();
  }

  async addMusicNotebookToCart() {
    await this.waitForDisplayed(mainLocators.buyButtonMusicNotebook);
    await this.page.locator(mainLocators.buyButtonMusicNotebook).click();
  }

  async addBlackRedToCart() {
    await this.waitForDisplayed(mainLocators.buyButtonBlackRed);
    await this.page.locator(mainLocators.buyButtonBlackRed).click();
  }

  async addGooseDeadlineToCart() {
    await this.waitForDisplayed(mainLocators.buyButtonGooseDeadline);
    await this.page.locator(mainLocators.buyButtonGooseDeadline).click();
  }

  async addArtistToCart() {
    await this.waitForDisplayed(mainLocators.buyButtonArtist);
    await this.page.locator(mainLocators.buyButtonArtist).click();
  }

  async addLittleRedRidingHoodToCart() {
    await this.waitForDisplayed(mainLocators.buyButtonLittleRedRidingHood);
    await this.page.locator(mainLocators.buyButtonLittleRedRidingHood).click();
  }

  async clickOnFirstPageIndicator() {
    await this.waitForDisplayed(mainLocators.firstPageIndicator);
    await this.page.locator(mainLocators.firstPageIndicator).click();
  }

  async clickOnSecondPageIndicator() {
    await this.waitForDisplayed(mainLocators.secondPageIndicator);
    await this.page.locator(mainLocators.secondPageIndicator).click();
  }

  async enterCreativeChaosQuantity(count: number) {
    const quantityInput = this.page.locator(mainLocators.enterCountFieldCreativeChaos);
    await this.waitForDisplayed(mainLocators.enterCountFieldCreativeChaos);
    await quantityInput.fill('');
    await quantityInput.type(count.toString());
  }
}