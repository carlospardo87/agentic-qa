// spec: specs/double-click-edit-todos-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';

test.beforeEach(async ({ page }) => {
  const todoPage = new TodoPage(page);
  await todoPage.goto();
});

test.describe('Double-click Todo Edit', () => {
  test('Scenario 1.1: Edit a todo item and save with Enter', async ({ page }) => {
    const todoPage = new TodoPage(page);

    // Add a new todo item with text "Read a book".
    await todoPage.addTodo('Read a book');

    const todo = todoPage.todoItems.first();

    // Double-click the todo item's label to enter edit mode.
    await todo.locator('label').dblclick();

    // Change the text to "Read two books" and press Enter.
    const edit = todo.locator('input.edit');
    await edit.fill('Read two books');
    await edit.press('Enter');

    // The todo item text updates to "Read two books".
    await expect(todo.getByTestId('todo-title')).toHaveText('Read two books');

    // The item remains visible in the list and count stays correct.
    await expect(todo).toBeVisible();
    await expect(todoPage.todoCount).toHaveText('1 item left');
  });

  test('Scenario 1.2: Edit a completed todo preserves completed state', async ({ page }) => {
    const todoPage = new TodoPage(page);

    // Add a new todo item with text "Submit report".
    await todoPage.addTodo('Submit report');
    const todo = todoPage.todoItems.first();

    // Mark the todo item as completed.
    await todo.getByRole('checkbox').check();
    await expect(todo.getByRole('checkbox')).toBeChecked();
    await expect(todoPage.todoCount).toHaveText('0 items left');

    // Double-click the completed todo label to start editing.
    await todo.locator('label').dblclick();

    // Change the text to "Submit final report" and press Enter.
    const edit = todo.locator('input.edit');
    await edit.fill('Submit final report');
    await edit.press('Enter');

    // The todo text updates and remains completed.
    await expect(todo.getByTestId('todo-title')).toHaveText('Submit final report');
    await expect(todo.getByRole('checkbox')).toBeChecked();
    await expect(todoPage.todoCount).toHaveText('0 items left');
  });

  test('Scenario 2.1: Cancel edit with Escape keeps original text', async ({ page }) => {
    const todoPage = new TodoPage(page);

    // Add a new todo item with text "Pay bills".
    await todoPage.addTodo('Pay bills');
    const todo = todoPage.todoItems.first();

    // Double-click the todo label to enter edit mode and change the text.
    await todo.locator('label').dblclick();
    const edit = todo.locator('input.edit');
    await edit.fill('Pay utility bills');

    // Press the Escape key to cancel.
    await edit.press('Escape');

    // Verify original text remains unchanged.
    await expect(todo.getByTestId('todo-title')).toHaveText('Pay bills');
  });

  test('Scenario 2.2: Clear text while editing removes the todo', async ({ page }) => {
    const todoPage = new TodoPage(page);

    // Add a new todo item with text "Call mom".
    await todoPage.addTodo('Call mom');
    const todo = todoPage.todoItems.first();

    // Double-click to edit and clear the text, then press Enter.
    await todo.locator('label').dblclick();
    const edit = todo.locator('input.edit');
    await edit.fill('');
    await edit.press('Enter');

    // The todo item is removed from the list.
    await expect(todoPage.todoItems).toHaveCount(0);
  });

  test('Scenario 2.3: Edit one todo without affecting others', async ({ page }) => {
    const todoPage = new TodoPage(page);

    // Add three todos.
    await todoPage.addTodo('Task A');
    await todoPage.addTodo('Task B');
    await todoPage.addTodo('Task C');

    // Ensure count is 3.
    await expect(todoPage.todoItems).toHaveCount(3);

    // Double-click only the label for "Task B" and update it.
    const todoB = todoPage.todoItems.nth(1);
    await todoB.locator('label').dblclick();
    const edit = todoB.locator('input.edit');
    await edit.fill('Task B updated');
    await edit.press('Enter');

    // Verify only Task B changed.
    await expect(todoPage.todoItems.nth(0).getByTestId('todo-title')).toHaveText('Task A');
    await expect(todoPage.todoItems.nth(1).getByTestId('todo-title')).toHaveText('Task B updated');
    await expect(todoPage.todoItems.nth(2).getByTestId('todo-title')).toHaveText('Task C');
    await expect(todoPage.todoCount).toHaveText('3 items left');
  });
});
