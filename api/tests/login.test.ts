import { expect } from 'chai';
import { getAuthenticatedClient } from '../utils/client';
import qs from 'qs';
import { allure } from 'allure-mocha/runtime';

describe('🛡️ eNotes API Auth Flow', () => {
  it('✅ Успешная аутентификация и получение токена', async () => {
    allure.epic('Аутентификация');
    allure.feature('Успешный вход');
    allure.severity('critical');
    allure.owner('QA Automation');

    const { client, csrfToken } = await getAuthenticatedClient();

    allure.step('Проверяем, что клиент и CSRF токен получены', () => {
      expect(client).to.exist;
      expect(csrfToken).to.be.a('string').and.not.empty;
    });
  });

  it('❌ Ошибка при отсутствии логина и пароля', async () => {
    const { client, csrfToken } = await getAuthenticatedClient();

    const payload = qs.stringify({
      'LoginForm[_csrf]': csrfToken
    });

    const response = await client.post('/login', payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      validateStatus: () => true
    });

    allure.step('Проверяем код ошибки при отсутствии логина и пароля', () => {
      expect(response.status).to.be.oneOf([400, 401]);
    });
  });

  it('❌ Ошибка при неверном CSRF токене', async () => {
    const { client } = await getAuthenticatedClient();

    const payload = qs.stringify({
      'LoginForm[username]': process.env.ENOTES_USERNAME,
      'LoginForm[password]': process.env.ENOTES_PASSWORD,
      'LoginForm[_csrf]': 'invalid-token'
    });

    const response = await client.post('/login', payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      validateStatus: () => true
    });

    allure.step('Проверяем код ошибки при неправильном CSRF токене', () => {
      expect(response.status).to.be.oneOf([400, 403]);
    });
  });

  it('❌ Ошибка при отсутствии CSRF токена', async () => {
    const { client } = await getAuthenticatedClient();

    const payload = qs.stringify({
      'LoginForm[username]': process.env.ENOTES_USERNAME,
      'LoginForm[password]': process.env.ENOTES_PASSWORD
    });

    const response = await client.post('/login', payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      validateStatus: () => true
    });

    allure.step('Проверяем код ошибки при отсутствии CSRF токена', () => {
      expect(response.status).to.be.oneOf([400, 403]);
    });
  });

  it('❌ Ошибка при неправильном пароле', async () => {
    const { client, csrfToken } = await getAuthenticatedClient();

    const payload = qs.stringify({
      'LoginForm[username]': process.env.ENOTES_USERNAME,
      'LoginForm[password]': 'неверный_пароль',
      'LoginForm[_csrf]': csrfToken
    });

    const response = await client.post('/login', payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      validateStatus: () => true
    });

    allure.step('Проверяем код ошибки при неправильном пароле', () => {
      expect(response.status).to.be.oneOf([400, 401, 403]);
    });
  });

  it('❌ Ошибка при отправке пустого тела запроса', async () => {
    const { client } = await getAuthenticatedClient();

    const response = await client.post('/login', '', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      validateStatus: () => true
    });

    allure.step('Проверяем код ошибки при пустом теле запроса', () => {
      expect(response.status).to.be.oneOf([400, 401, 403]);
    });
  });
});
