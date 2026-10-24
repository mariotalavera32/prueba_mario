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
});
