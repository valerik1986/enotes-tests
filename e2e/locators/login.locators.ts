export const loginLocators = {
  mainHeader: 'xpath=//h1[contains(text(),"Авторизация")]',
  subHeader: 'xpath=//p[contains(text(),"Пожалуйста, заполните поля для авторизации:")]',
  loginFieldLabel: 'xpath=//label[@for="loginform-username"]',
  loginField: 'xpath=//input[@id="loginform-username"]',
  passwordFieldLabel: 'xpath=//label[@for="loginform-password"]',
  passwordField: 'xpath=//input[@id="loginform-password"]',
  loginButton: 'xpath=//button[@name="login-button"]',
  remembermeCheckbox: 'xpath=//input[@id="loginform-rememberme"]',
  remembermecheckboxLabel: 'xpath=//label[@for="loginform-rememberme"]',
};
