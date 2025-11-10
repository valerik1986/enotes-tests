import axios from 'axios';
import * as dotenv from 'dotenv';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import qs from 'qs';

dotenv.config();

const baseURL = process.env.BASE_URL!;
const username = process.env.ENOTES_USERNAME!;
const password = process.env.ENOTES_PASSWORD!;

export async function getAuthenticatedClient() {
  const jar = new CookieJar();
  const client = wrapper(axios.create({ baseURL, jar, withCredentials: true }));

  const loginPage = await client.get('/login');
  const match = loginPage.data.match(/<meta name="csrf-token" content="(.+?)"/);
  const csrfToken = match?.[1] || '';
  if (!csrfToken) throw new Error('CSRF token not found');

  const payload = qs.stringify({
    'LoginForm[username]': process.env.ENOTES_USERNAME,
    'LoginForm[password]': process.env.ENOTES_PASSWORD,
    'LoginForm[rememberMe]': 1,
    'LoginForm[_csrf]': csrfToken
  });

  const res = await client.post('/product/get', payload, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Csrf-Token': csrfToken
    }
  });

  if (res.status !== 200 || res.data.response !== true) {
    throw new Error('Authentication failed');
  }

  return { client, csrfToken };
}
