import { expect } from 'chai';
import { getAuthenticatedClient } from '../utils/client';
import qs from 'qs';
import schema from '../schemas/product-list.schema.json';
import Ajv from 'ajv';
import { expectedProducts } from './data/expected-products';
import { allure } from 'allure-mocha/runtime';

const ajv = new Ajv({ allErrors: true });

interface Product {
  id: number;
  name: string;
  type: string;
  price: number;
  discount: number;
  count: number;
  poster: string;
}

let client: any;
let csrfToken: string;
let fullResponse: any;
let allProducts: Product[] = [];

describe('🧪 API Tests for /product/get', () => {
  before(async function () {
    const result = await getAuthenticatedClient();
    client = result.client;
    csrfToken = result.csrfToken;

    const payload = qs.stringify({
      'LoginForm[username]': process.env.ENOTES_USERNAME,
      'LoginForm[password]': process.env.ENOTES_PASSWORD,
      'LoginForm[_csrf]': csrfToken
    });

    fullResponse = await client.post('/product/get', payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Csrf-Token': csrfToken
      }
    });
  });

  it('✅ Возвращается статус 200 и корректный формат (страница 1)', () => {
    allure.epic('eNotes API');
    allure.feature('Продукты');
    allure.owner('QA Engineer');
    allure.severity('critical');
    allure.description('Проверка статуса и структуры ответа первой страницы');

    expect(fullResponse.status).to.equal(200);
    expect(fullResponse.data.response).to.be.true;
    expect(fullResponse.data.products).to.be.an('array');
    expect(fullResponse.data.page).to.be.a('number');
    expect(fullResponse.data.pages).to.be.a('number');
  });

  it('✅ Соответствие JSON Schema на странице 1', () => {
    allure.severity('normal');
    allure.description('Проверка соответствия JSON Schema');

    const validate = ajv.compile(schema);
    const valid = validate(fullResponse.data);
    if (!valid) {
      console.error('❌ Ошибки схемы (страница 1):', validate.errors);
    }
    expect(valid).to.be.true;
  });

  it('✅ Соответствие JSON Schema на всех страницах', async () => {
    allure.severity('critical');
    allure.description('Проверка всех страниц с продукцией по JSON Schema');

    const validate = ajv.compile(schema);
    const totalPages = fullResponse.data.pages;

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      await allure.step(`Проверка страницы ${pageNum}`, async () => {
        const payload = qs.stringify({
          'LoginForm[username]': process.env.ENOTES_USERNAME,
          'LoginForm[password]': process.env.ENOTES_PASSWORD,
          'LoginForm[_csrf]': csrfToken,
          page: pageNum
        });

        const pageResponse = await client.post('/product/get', payload, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Csrf-Token': csrfToken
          }
        });

        const isValid = validate(pageResponse.data);
        if (!isValid) {
          console.error(`❌ Ошибки схемы на странице ${pageNum}:`, validate.errors);
        }
        expect(isValid, `Ошибка валидации на странице ${pageNum}`).to.be.true;

        allProducts.push(...pageResponse.data.products);
      });
    }
  });

  it('✅ Каждое поле продукта корректно по структуре и типам', () => {
    allure.severity('normal');
    allure.description('Проверка структуры каждого продукта');

    allProducts.forEach((product: Product, index: number) => {
      expect(product, `Product ${index}`).to.have.all.keys(
        'id',
        'name',
        'type',
        'price',
        'discount',
        'count',
        'poster'
      );

      expect(product.id, `Product ${index} - id`).to.be.a('number');
      expect(product.name, `Product ${index} - name`).to.be.a('string');
      expect(product.type, `Product ${index} - type`).to.be.a('string');
      expect(product.price, `Product ${index} - price`).to.be.a('number');
      expect(product.discount, `Product ${index} - discount`).to.be.a('number');
      expect(product.count, `Product ${index} - count`).to.be.a('number');
      expect(product.poster, `Product ${index} - poster`).to.be.a('string');
    });
  });

  it('✅ Каждое значение продукта соответствует ожидаемым данным', () => {
    allure.severity('critical');
    allure.description('Проверка соответствия данных ожидаемым значениям');

    expect(allProducts.length).to.equal(expectedProducts.length);

    allProducts.forEach((actual: Product, i: number) => {
      const expected = expectedProducts[i];
      const label = `Product ${i + 1}`;

      expect(actual.id, `${label} - id`).to.equal(expected.id);
      expect(actual.name, `${label} - name`).to.equal(expected.name);
      expect(actual.type, `${label} - type`).to.equal(expected.type);
      expect(actual.price, `${label} - price`).to.equal(expected.price);
      expect(actual.discount, `${label} - discount`).to.equal(expected.discount);
      expect(actual.count, `${label} - count`).to.equal(expected.count);
      expect(actual.poster, `${label} - poster`).to.equal(expected.poster);
    });
  });
});
