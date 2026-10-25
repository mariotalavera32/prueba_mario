import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../src/api/app';
import { Task } from '../src/api/task.model';

const app = createApp();
let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  await Task.init();
}, 120_000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

beforeEach(async () => {
  await Task.deleteMany({});
});

const create = (title: string, extra: object = {}) => request(app).post('/tasks').send({ title, ...extra });
const missingId = '64b7f0f0f0f0f0f0f0f0f0f0';

describe('POST /tasks', () => {
  it('crea una tarea y la persiste', async () => {
    const res = await create('Comprar leche');
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ title: 'Comprar leche', completed: false });
    expect(await Task.countDocuments()).toBe(1);
  });

  it('recorta espacios del título', async () => {
    const res = await create('  hola  ');
    expect(res.body.title).toBe('hola');
  });

  it.each([
    ['sin título', {}],
    ['título vacío', { title: '' }],
    ['título de 101 caracteres', { title: 'a'.repeat(101) }],
  ])('rechaza %s con 400', async (_caso, body) => {
    const res = await request(app).post('/tasks').send(body);
    expect(res.status).toBe(400);
  });

  it('rechaza JSON malformado con 400', async () => {
    const res = await request(app).post('/tasks').set('Content-Type', 'application/json').send('{mal');
    expect(res.status).toBe(400);
  });

  it('rechaza títulos duplicados con 409', async () => {
    await create('repetida');
    const res = await create('repetida');
    expect(res.status).toBe(409);
  });
});

describe('GET /tasks', () => {
  it('lista vacía al inicio', async () => {
    const res = await request(app).get('/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ items: [], total: 0, page: 1 });
  });

  it('pagina los resultados', async () => {
    for (let i = 1; i <= 5; i++) await create(`t${i}`);
    const res = await request(app).get('/tasks?page=2&limit=2');
    expect(res.body.total).toBe(5);
    expect(res.body.items.map((t: any) => t.title)).toEqual(['t3', 't4']);
  });

  it('filtra por completed', async () => {
    await create('a', { completed: true });
    await create('b');
    const res = await request(app).get('/tasks?completed=true');
    expect(res.body.items.map((t: any) => t.title)).toEqual(['a']);
  });

  it('limita el tamaño máximo de página', async () => {
    const res = await request(app).get('/tasks?limit=9999');
    expect(res.body.limit).toBe(50);
  });
});

describe('GET /tasks/:id', () => {
  it('devuelve la tarea', async () => {
    const { body } = await create('x');
    const res = await request(app).get(`/tasks/${body._id}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('x');
  });

  it('404 si no existe', async () => {
    expect((await request(app).get(`/tasks/${missingId}`)).status).toBe(404);
  });

  it('400 si el ID es inválido', async () => {
    expect((await request(app).get('/tasks/abc')).status).toBe(400);
  });
});

describe('PUT /tasks/:id', () => {
  it('actualiza título y estado', async () => {
    const { body } = await create('viejo');
    const res = await request(app).put(`/tasks/${body._id}`).send({ title: 'nuevo', completed: true });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ title: 'nuevo', completed: true });
  });

  it('valida el título al actualizar', async () => {
    const { body } = await create('ok');
    const res = await request(app).put(`/tasks/${body._id}`).send({ title: '' });
    expect(res.status).toBe(400);
  });

  it('404 si no existe', async () => {
    expect((await request(app).put(`/tasks/${missingId}`).send({ title: 'x' })).status).toBe(404);
  });
});

describe('DELETE /tasks/:id', () => {
  it('elimina la tarea', async () => {
    const { body } = await create('borrar');
    expect((await request(app).delete(`/tasks/${body._id}`)).status).toBe(204);
    expect(await Task.countDocuments()).toBe(0);
  });

  it('404 si no existe', async () => {
    expect((await request(app).delete(`/tasks/${missingId}`)).status).toBe(404);
  });
});
