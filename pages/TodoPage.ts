import { Page, Locator, expect } from '@playwright/test';

export class TodoPage {
  readonly input: Locator;
  readonly items: Locator;
  readonly counter: Locator;

  constructor(private page: Page) {
    this.input = page.getByPlaceholder('What needs to be done?');
    this.items = page.getByTestId('todo-item');
    this.counter = page.getByTestId('todo-count');
  }

  async goto() {
    await this.page.goto('./');
  }

  async add(...titles: string[]) {
    for (const t of titles) {
      await this.input.fill(t);
      await this.input.press('Enter');
    }
  }

  async toggle(title: string) {
    await this.items.filter({ hasText: title }).getByRole('checkbox').check();
  }

  async remove(title: string) {
    const item = this.items.filter({ hasText: title });
    await item.hover();
    await item.getByRole('button', { name: 'Delete' }).click();
  }

  async edit(title: string, newTitle: string) {
    const item = this.items.filter({ hasText: title });
    await item.dblclick();
    const editor = item.getByRole('textbox', { name: 'Edit' });
    await editor.fill(newTitle);
    await editor.press('Enter');
  }

  async filter(name: 'All' | 'Active' | 'Completed') {
    await this.page.getByRole('link', { name }).click();
  }

  async expectTitles(titles: string[]) {
    await expect(this.items).toHaveText(titles);
  }
}
