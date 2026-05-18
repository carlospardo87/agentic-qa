import { type Locator, type Page } from '@playwright/test';

export class TodoPage {
  readonly page: Page;
  readonly todoInput: Locator;
  readonly todoList: Locator;
  readonly todoItems: Locator;
  readonly todoCount: Locator;
  readonly clearCompletedButton: Locator;
  readonly toggleAllCheckbox: Locator;
  readonly footer: Locator;
  readonly filterAllLink: Locator;
  readonly filterActiveLink: Locator;
  readonly filterCompletedLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.todoInput = page.getByPlaceholder('What needs to be done?');
    this.todoList = page.getByTestId('todo-list');
    this.todoItems = page.getByTestId('todo-item');
    this.todoCount = page.getByTestId('todo-count');
    this.clearCompletedButton = page.getByRole('button', { name: 'Clear completed' });
    this.toggleAllCheckbox = page.getByLabel('Mark all as complete');
    this.footer = page.locator('.footer');
    this.filterAllLink = page.getByRole('link', { name: 'All' });
    this.filterActiveLink = page.getByRole('link', { name: 'Active' });
    this.filterCompletedLink = page.getByRole('link', { name: 'Completed' });
  }

  async goto() {
    await this.page.goto('./');
  }

  async addTodo(text: string) {
    await this.todoInput.fill(text);
    await this.todoInput.press('Enter');
  }

  getTodoItem(text: string): Locator {
    return this.todoItems.filter({ hasText: text });
  }

  async deleteTodo(text: string) {
    const todo = this.getTodoItem(text);
    await todo.hover();
    await todo.locator('.destroy').click();
  }

  async markTodoCompleted(text: string) {
    const todo = this.getTodoItem(text);
    await todo.getByRole('checkbox').check();
  }

  async markAllCompleted() {
    await this.toggleAllCheckbox.check();
  }

  async clearCompleted() {
    await this.clearCompletedButton.click();
  }
}
