import { test, expect } from '@playwright/test';

const unique = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

test.describe.configure({ mode: 'serial' });

test('flujo completo: crear, leer, actualizar y borrar', async ({ request }) => {
  const title = unique('flujo');

  const created = await request.post('/tasks', { data: { title } });
  expect(created.status()).toBe(201);
  const task = await created.json();
  expect(task).toMatchObject({ title, completed: false });

  const read = await request.get(`/tasks/${task._id}`);
  expect(read.status()).toBe(200);
  expect(await read.json()).toMatchObject({ _id: task._id, title });

  const updated = await request.put(`/tasks/${task._id}`, { data: { completed: true } });
  expect(updated.status()).toBe(200);
  expect(await updated.json()).toMatchObject({ title, completed: true });

  const removed = await request.delete(`/tasks/${task._id}`);
  expect(removed.status()).toBe(204);

  expect((await request.get(`/tasks/${task._id}`)).status()).toBe(404);
});

test('la tarea creada aparece en el listado', async ({ request }) => {
  const title = unique('listado');
  await request.post('/tasks', { data: { title } });
  const res = await request.get('/tasks?limit=50');
  const { items } = await res.json();
  expect(items.map((t: { title: string }) => t.title)).toContain(title);
});

test('rechaza títulos duplicados con 409', async ({ request }) => {
  const title = unique('dup');
  expect((await request.post('/tasks', { data: { title } })).status()).toBe(201);
  expect((await request.post('/tasks', { data: { title } })).status()).toBe(409);
});

for (const [caso, data] of [
  ['sin título', {}],
  ['título vacío', { title: '' }],
  ['título demasiado largo', { title: 'a'.repeat(101) }],
] as const) {
  test(`validación: ${caso} devuelve 400`, async ({ request }) => {
    const res = await request.post('/tasks', { data });
    expect(res.status()).toBe(400);
    expect(await res.json()).toHaveProperty('error');
  });
}

test('ID inválido devuelve 400 y ID inexistente 404', async ({ request }) => {
  expect((await request.get('/tasks/abc')).status()).toBe(400);
  expect((await request.get('/tasks/64b7f0f0f0f0f0f0f0f0f0f0')).status()).toBe(404);
});

test('paginación y filtro por estado', async ({ request }) => {
  const done = unique('hecha');
  await request.post('/tasks', { data: { title: done, completed: true } });

  const completed = await (await request.get('/tasks?completed=true&limit=50')).json();
  expect(completed.items.every((t: { completed: boolean }) => t.completed)).toBe(true);
  expect(completed.items.map((t: { title: string }) => t.title)).toContain(done);

  const page = await (await request.get('/tasks?limit=1')).json();
  expect(page.items).toHaveLength(1);
  expect(page.limit).toBe(1);
});

test('GET /health responde ok', async ({ request }) => {
  const res = await request.get('/health');
  expect(await res.json()).toEqual({ status: 'ok' });
});
