import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { MainPage } from '../pages/main.page';
import { BasketPage } from '../pages/basket.page';
import dotenv from 'dotenv';

dotenv.config();

test('Полный сценарий UI: логин, проверка элементов, корзина', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const mainPage = new MainPage(page);
  const basketPage = new BasketPage(page);

  await test.step('Логин', async () => {
    await loginPage.goto();
    await loginPage.verifyLoginPageElements();
    await loginPage.login(process.env.ENOTES_USERNAME!, process.env.ENOTES_PASSWORD!);
    await mainPage.closeAlertIfVisible();
    await mainPage.verifyUserAvatarVisible();
    await mainPage.verifyUserNameVisible('TEST');
  });

  await test.step('Проверка UI элементов на главной', async () => {
    await expect.soft(await mainPage.isBasketIconVisible()).toBeTruthy();
    await mainPage.verifyCartNameVisible();
    await mainPage.verifyBasketCountOnMainPage('0');
    await mainPage.verifySearchFiltersVisible();
    await mainPage.verifyDiscountCheckboxLabelText('Показать только со скидкой');
  });

  await test.step('Негатив: клик по пустой корзине', async () => {
    await mainPage.tryClickCartIconWhenEmpty();
  });

  await test.step('Добавить товар "Блокнот в точку"', async () => {
    await mainPage.addNotepadToPointToCart();
    await mainPage.verifyBasketCountOnMainPage('1');
    await mainPage.openCartDropdown();
    await basketPage.waitForCartDropdownVisible();
    await basketPage.verifyDeleteIconVisible();
    await basketPage.verifyItemPosterVisible();
    await basketPage.verifyItemTitle(['Блокнот в точку']);
    await basketPage.verifyItemPrice(['- 400 р.']);
    await basketPage.verifyItemCount(['1']);
    await basketPage.verifyCartTotal('Итого к оплате: ', '400');
    await basketPage.verifyGoToCartButtonVisible();
    await basketPage.verifyClearCartButtonVisible();
    await basketPage.clickGoToCartButton();
    await expect(page).toHaveURL('https://enotes.pointschool.ru/basket');
    await basketPage.checkBasketServerError();
    await mainPage.clickNavbarBrand();
  });

  await test.step('Очистить корзину', async () => {
    await mainPage.openCartDropdown();
    await basketPage.waitForCartDropdownVisible();
    await basketPage.clickClearBasketButton();
    await mainPage.verifyBasketCountOnMainPage('0');
  });

  await test.step('Добавить акционный товар', async () => {
    await mainPage.addGameOfThronesToCart();
    await expect.soft(await mainPage.isBasketIconVisible()).toBeTruthy();
    await mainPage.verifyBasketCountOnMainPage('1');
    await mainPage.addPromotionalItemAndVerifyBasketIcon();
  });

  await test.step('Добавить 9 товаров и проверить открытие всплывающей корзины', async () => {
    await mainPage.addNotepadToPointToCart();
    await mainPage.addCreativeChaosBookToCart();
    await mainPage.addCatMaryToCart();
    await mainPage.addMusicNotebookToCart();
    await mainPage.addBlackRedToCart();
    await mainPage.addGooseDeadlineToCart();
    await mainPage.addArtistToCart();
    await mainPage.clickOnSecondPageIndicator();
    await mainPage.addLittleRedRidingHoodToCart();
    await mainPage.verifyBasketCountOnMainPage('9');
    await mainPage.clickOnCartName();
    await basketPage.waitForCartDropdownVisible();
  });

  await test.step('Добавить 10-й товар, открыть корзину, очистить', async () => {
    await basketPage.clickNavBar();
    await mainPage.addNotepadToPointToCart();
    await mainPage.verifyBasketCountOnMainPage('10');
    await mainPage.clickOnCartName();
    await basketPage.waitForCartDropdownVisible();
    await basketPage.clickClearBasketButton();
    await mainPage.verifyBasketCountOnMainPage('0');
  });

  await test.step('Добавить 9+1 товаров вручную, проверить корзину', async () => {
    await mainPage.enterCreativeChaosQuantity(9);
    await mainPage.addCreativeChaosBookToCart();
    await mainPage.addGameOfThronesToCart();
    await mainPage.verifyBasketCountOnMainPage('10');
    await mainPage.clickOnCartName();
    await basketPage.waitForCartDropdownVisible();
    await basketPage.verifyItemTitle(['Творческий беспорядок', 'Игра престолов']);
    await basketPage.verifyItemPrice(['- 3600 р.', '- 285 р.']);
    await basketPage.verifyItemCount(['9', '1']);

    const actualTotal = await basketPage.getCartTotalValue();
    await expect.soft(actualTotal).toBe('3885');

    await basketPage.clickClearBasketButton();
    await mainPage.verifyBasketCountOnMainPage('0');
  });
});