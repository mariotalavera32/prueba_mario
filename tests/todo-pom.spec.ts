import { test as base, expect } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';

const test = base.extend<{ todo: TodoPage }>({
  todo: async ({ page }, use) => {
    const todo = new TodoPage(page);
    await todo.goto();
    await use(todo);
  },
});

test.describe('TodoMVC con Page Object', () => {
  test('agrega varias tareas', async ({ todo }) => {
    await todo.add('Leer', 'Practicar', 'Automatizar');
    await todo.expectTitles(['Leer', 'Practicar', 'Automatizar']);
    await expect(todo.counter).toContainText('3');
  });

  test('elimina una tarea', async ({ todo }) => {
    await todo.add('A', 'B');
    await todo.remove('A');
    await todo.expectTitles(['B']);
  });

  test('edita una tarea', async ({ todo }) => {
    await todo.add('Viejo');
    await todo.edit('Viejo', 'Nuevo');
    await todo.expectTitles(['Nuevo']);
  });

  test('no agrega tareas vacías', async ({ todo }) => {
    await todo.add('   ');
    await expect(todo.items).toHaveCount(0);
  });

  test('persiste al recargar', async ({ todo, page }) => {
    await todo.add('Persistente');
    await page.reload();
    await todo.expectTitles(['Persistente']);
  });

  test('filtra tareas completadas', async ({ todo }) => {
    await todo.add('Hecha', 'Pendiente');
    await todo.toggle('Hecha');
    await todo.filter('Completed');
    await todo.expectTitles(['Hecha']);
    await todo.filter('Active');
    await todo.expectTitles(['Pendiente']);
  });
});
