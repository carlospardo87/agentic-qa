// spec: specs/clear-completed-todos-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';

test.beforeEach(async ({ page }) => {
  const todoPage = new TodoPage(page);
  await todoPage.goto();
});

test.describe('1. Happy Path Scenarios', () => {
  test('Scenario 1.1: Clear a single completed todo', async ({ page }) => {
    const todoPage = new TodoPage(page);

    // 1. Add a new todo item: "Buy milk".
    await todoPage.addTodo('Buy milk');

    // 2. Click the checkbox to mark it as completed.
    await todoPage.markTodoCompleted('Buy milk');

    // 3. Verify that the "Clear completed" button becomes visible.
    await expect(todoPage.clearCompletedButton).toBeVisible();

    // 4. Click the "Clear completed" button.
    await todoPage.clearCompleted();

    // Expected Outcomes:
    await expect(todoPage.todoItems).toHaveCount(0);
    await expect(todoPage.footer).not.toBeVisible();
    await expect(todoPage.clearCompletedButton).not.toBeVisible();
  });

  test('Scenario 1.2: Clear multiple completed todos while leaving active ones', async ({ page }) => {
    const todoPage = new TodoPage(page);

    // 1. Add items
    await todoPage.addTodo('Task A');
    await todoPage.addTodo('Task B');
    await todoPage.addTodo('Task C');

    // 2. Mark specific items as completed
    await todoPage.markTodoCompleted('Task A');
    await todoPage.markTodoCompleted('Task C');

    // 3. Verify the item counter
    await expect(todoPage.todoCount).toHaveText('1 item left');

    // 4. Click "Clear completed"
    await todoPage.clearCompleted();

    // Expected Outcomes:
    await expect(todoPage.todoItems).toHaveCount(1);
    await expect(todoPage.todoItems.first().getByTestId('todo-title')).toHaveText('Task B');
    await expect(todoPage.clearCompletedButton).not.toBeVisible();
    await expect(todoPage.todoCount).toHaveText('1 item left');
  });
});

test.describe('2. Edge Cases', () => {
  test('Scenario 2.1: Complete all tasks and clear them', async ({ page }) => {
    const todoPage = new TodoPage(page);

    // 1. Add items
    await todoPage.addTodo('Task X');
    await todoPage.addTodo('Task Y');

    // 2. Mark all as complete
    await todoPage.markAllCompleted();

    // 3. Clear completed
    await todoPage.clearCompleted();

    // Expected Outcomes:
    await expect(todoPage.todoItems).toHaveCount(0);
    await expect(todoPage.footer).not.toBeVisible();
  });
});

test.describe('3. Negative Testing Scenarios', () => {
  test('Scenario 3.1: "Clear completed" button is hidden when no tasks are completed', async ({ page }) => {
    const todoPage = new TodoPage(page);

    // 1. Add item
    await todoPage.addTodo('Active Task');

    // 2. Do NOT check the checkbox.
    const todoItem = todoPage.getTodoItem('Active Task');
    await expect(todoItem.getByRole('checkbox')).not.toBeChecked();

    // Expected Outcomes:
    await expect(todoPage.footer).toBeVisible();
    await expect(todoPage.todoCount).toHaveText('1 item left');
    await expect(todoPage.clearCompletedButton).not.toBeVisible();
  });
});
