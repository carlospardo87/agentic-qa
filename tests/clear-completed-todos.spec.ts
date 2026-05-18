// spec: specs/clear-completed-todos-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./');
});

test.describe('1. Happy Path Scenarios', () => {
  test('Scenario 1.1: Clear a single completed todo', async ({ page }) => {
    // 1. Add a new todo item: "Buy milk".
    const todoInput = page.getByPlaceholder('What needs to be done?');
    await todoInput.fill('Buy milk');
    await todoInput.press('Enter');

    // 2. Click the checkbox next to "Buy milk" to mark it as completed.
    const todoItem = page.getByTestId('todo-item').filter({ hasText: 'Buy milk' });
    await todoItem.getByRole('checkbox').check();

    // 3. Verify that the "Clear completed" button becomes visible in the footer.
    const clearCompletedButton = page.getByRole('button', { name: 'Clear completed' });
    await expect(clearCompletedButton).toBeVisible();

    // 4. Click the "Clear completed" button.
    await clearCompletedButton.click();

    // Expected Outcomes:
    // - The "Buy milk" item is removed from the list.
    await expect(page.getByTestId('todo-item')).toHaveCount(0);
    // - The footer and the "Clear completed" button are no longer visible.
    await expect(page.locator('.footer')).not.toBeVisible();
    await expect(clearCompletedButton).not.toBeVisible();
  });

  test('Scenario 1.2: Clear multiple completed todos while leaving active ones', async ({ page }) => {
    const todoInput = page.getByPlaceholder('What needs to be done?');

    // 1. Add three new todo items: "Task A", "Task B", "Task C".
    await todoInput.fill('Task A');
    await todoInput.press('Enter');
    await todoInput.fill('Task B');
    await todoInput.press('Enter');
    await todoInput.fill('Task C');
    await todoInput.press('Enter');

    // 2. Click the checkbox next to "Task A" and "Task C" to mark them as completed.
    const todoItems = page.getByTestId('todo-item');
    await todoItems.filter({ hasText: 'Task A' }).getByRole('checkbox').check();
    await todoItems.filter({ hasText: 'Task C' }).getByRole('checkbox').check();

    // 3. Verify the item counter reads "1 item left".
    await expect(page.getByTestId('todo-count')).toHaveText('1 item left');

    // 4. Click the "Clear completed" button.
    const clearCompletedButton = page.getByRole('button', { name: 'Clear completed' });
    await clearCompletedButton.click();

    // Expected Outcomes:
    // - "Task A" and "Task C" are removed from the list.
    // - "Task B" remains in the list.
    await expect(todoItems).toHaveCount(1);
    await expect(todoItems.first().getByTestId('todo-title')).toHaveText('Task B');

    // - The "Clear completed" button disappears because there are no longer any completed tasks.
    await expect(clearCompletedButton).not.toBeVisible();
    // - The item counter still reads "1 item left".
    await expect(page.getByTestId('todo-count')).toHaveText('1 item left');
  });
});

test.describe('2. Edge Cases', () => {
  test('Scenario 2.1: Complete all tasks and clear them', async ({ page }) => {
    const todoInput = page.getByPlaceholder('What needs to be done?');

    // 1. Add "Task X" and "Task Y".
    await todoInput.fill('Task X');
    await todoInput.press('Enter');
    await todoInput.fill('Task Y');
    await todoInput.press('Enter');

    // 2. Click the "Mark all as complete" toggle at the top of the list.
    await page.getByLabel('Mark all as complete').check();

    // 3. Click the "Clear completed" button.
    await page.getByRole('button', { name: 'Clear completed' }).click();

    // Expected Outcomes:
    // - Both "Task X" and "Task Y" are removed.
    // - The list is completely empty.
    await expect(page.getByTestId('todo-item')).toHaveCount(0);
    // - The footer disappears.
    await expect(page.locator('.footer')).not.toBeVisible();
  });
});

test.describe('3. Negative Testing Scenarios', () => {
  test('Scenario 3.1: "Clear completed" button is hidden when no tasks are completed', async ({ page }) => {
    const todoInput = page.getByPlaceholder('What needs to be done?');

    // 1. Add a new todo item: "Active Task".
    await todoInput.fill('Active Task');
    await todoInput.press('Enter');

    // 2. Do NOT check the checkbox.
    const todoItem = page.getByTestId('todo-item').first();
    await expect(todoItem.getByRole('checkbox')).not.toBeChecked();

    // Expected Outcomes:
    // - The footer is visible.
    await expect(page.locator('.footer')).toBeVisible();
    // - The item counter displays "1 item left".
    await expect(page.getByTestId('todo-count')).toHaveText('1 item left');
    // - The "Clear completed" button is NOT visible in the DOM.
    await expect(page.getByRole('button', { name: 'Clear completed' })).not.toBeVisible();
  });
});
