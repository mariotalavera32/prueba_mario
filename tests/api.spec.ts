import { test, expect } from '@playwright/test';

test('GET /posts/1 devuelve un post válido', async ({ request }) => {
  const res = await request.get('https://jsonplaceholder.typicode.com/posts/1');
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body).toMatchObject({ id: 1, userId: expect.any(Number) });
});

test('POST /posts crea un recurso', async ({ request }) => {
  const res = await request.post('https://jsonplaceholder.typicode.com/posts', {
    data: { title: 'qa', body: 'demo', userId: 1 },
  });
  expect(res.status()).toBe(201);
  expect(await res.json()).toMatchObject({ title: 'qa', body: 'demo', userId: 1 });
});

test('GET /posts/99999 devuelve 404', async ({ request }) => {
  const res = await request.get('https://jsonplaceholder.typicode.com/posts/99999');
  expect(res.status()).toBe(404);
});

test('GET /posts devuelve una lista de 100 posts', async ({ request }) => {
  const res = await request.get('https://jsonplaceholder.typicode.com/posts');
  expect(res.status()).toBe(200);
  expect(await res.json()).toHaveLength(100);
});
