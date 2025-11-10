import { Page, expect } from '@playwright/test';
import { loginLocators } from '../locators/login.locators';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(username: string, password: string) {
    const loginInput = this.page.locator(loginLocators.loginField);
    const passwordInput = this.page.locator(loginLocators.passwordField);
    const loginBtn = this.page.locator(loginLocators.loginButton);

    await loginInput.waitFor({ state: 'visible', timeout: 5000 });
    await loginInput.click();
    await loginInput.fill('');
    await loginInput.type(username, { delay: 50 });

    await passwordInput.click();
    await passwordInput.fill('');
    await passwordInput.type(password, { delay: 50 });

    await loginBtn.waitFor({ state: 'visible', timeout: 5000 });

    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'load', timeout: 10000 }),
      loginBtn.click(),
    ]);
  }

  async verifyLoginPageElements() {
    await this.waitForDisplayed(loginLocators.mainHeader);
    await this.waitForDisplayed(loginLocators.subHeader);
    await this.waitForDisplayed(loginLocators.loginFieldLabel);
    await this.waitForDisplayed(loginLocators.loginField);
    await this.waitForDisplayed(loginLocators.passwordFieldLabel);
    await this.waitForDisplayed(loginLocators.passwordField);
    await this.waitForDisplayed(loginLocators.remembermeCheckbox);
    await this.waitForDisplayed(loginLocators.remembermecheckboxLabel);
    await this.waitForDisplayed(loginLocators.loginButton);

    const headerText = await this.getText(loginLocators.mainHeader);
    expect(headerText).toBe('Авторизация');

    const subHeaderText = await this.getText(loginLocators.subHeader);
    expect(subHeaderText).toContain('Пожалуйста, заполните поля для авторизации:');

    const loginLabel = await this.getText(loginLocators.loginFieldLabel);
    expect(loginLabel).toBe('Логин');

    const passwordLabel = await this.getText(loginLocators.passwordFieldLabel);
    expect(passwordLabel).toBe('Пароль');

    const rememberText = await this.getText(loginLocators.remembermecheckboxLabel);
    expect(rememberText.trim()).toBe('Запомнить меня');

    const loginButtonText = await this.getText(loginLocators.loginButton);
    expect(loginButtonText).toBe('Вход');
  }
}