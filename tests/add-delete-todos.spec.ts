// spec: specs/add-delete-todos-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./');
});

test.describe('1. Happy Path Scenarios', () => {
  test('Scenario 1.1: Add and delete a single todo', async ({ page }) => {
    // 1. Type "Task to delete" in the main input field and press Enter.
    const todoInput = page.getByPlaceholder('What needs to be done?');
    await todoInput.fill('Task to delete');
    await todoInput.press('Enter');

    // 2. Verify the item "Task to delete" appears in the list.
    const todoItem = page.getByTestId('todo-item').first();
    await expect(todoItem.getByTestId('todo-title')).toHaveText('Task to delete');

    // 3. Hover over the "Task to delete" list item to reveal the delete button
    await todoItem.hover();

    // 4. Click the delete button.
    const deleteButton = todoItem.getByRole('button', { name: 'Delete' });
    await deleteButton.click();

    // Expected Outcomes:
    // - The item "Task to delete" is removed from the list.
    await expect(page.getByTestId('todo-item')).toHaveCount(0);
    // - The footer containing the counter is no longer visible.
    await expect(page.locator('.footer')).not.toBeVisible();
  });

  test('Scenario 1.2: Delete a specific todo from a list of multiple items', async ({ page }) => {
    const todoInput = page.getByPlaceholder('What needs to be done?');

    // 1. Type "Task 1" in the main input field and press Enter.
    await todoInput.fill('Task 1');
    await todoInput.press('Enter');

    // 2. Type "Task 2" in the main input field and press Enter.
    await todoInput.fill('Task 2');
    await todoInput.press('Enter');

    // 3. Type "Task 3" in the main input field and press Enter.
    await todoInput.fill('Task 3');
    await todoInput.press('Enter');

    // 4. Hover over "Task 2" in the list.
    const todoItems = page.getByTestId('todo-item');
    const task2 = todoItems.filter({ hasText: 'Task 2' });
    await task2.hover();

    // 5. Click the delete button for "Task 2".
    await task2.getByRole('button', { name: 'Delete' }).click();

    // Expected Outcomes:
    // - "Task 2" is removed from the list.
    await expect(todoItems).toHaveCount(2);
    // - "Task 1" and "Task 3" remain in the list.
    await expect(todoItems.nth(0).getByTestId('todo-title')).toHaveText('Task 1');
    await expect(todoItems.nth(1).getByTestId('todo-title')).toHaveText('Task 3');
    // - The item counter at the bottom updates to "2 items left".
    await expect(page.getByTestId('todo-count')).toHaveText('2 items left');
  });
});

test.describe('2. Edge Cases', () => {
  test('Scenario 2.1: Delete all items one by one', async ({ page }) => {
    const todoInput = page.getByPlaceholder('What needs to be done?');

    // 1. Type "First" and press Enter.
    await todoInput.fill('First');
    await todoInput.press('Enter');

    // 2. Type "Second" and press Enter.
    await todoInput.fill('Second');
    await todoInput.press('Enter');

    // 3. Hover and click delete on "First".
    const firstTask = page.getByTestId('todo-item').filter({ hasText: 'First' });
    await firstTask.hover();
    await firstTask.getByRole('button', { name: 'Delete' }).click();

    // 4. Hover and click delete on "Second".
    const secondTask = page.getByTestId('todo-item').filter({ hasText: 'Second' });
    await secondTask.hover();
    await secondTask.getByRole('button', { name: 'Delete' }).click();

    // Expected Outcomes:
    // - The list is completely empty.
    await expect(page.getByTestId('todo-item')).toHaveCount(0);
    // - The item counter and the entire footer are no longer visible.
    await expect(page.locator('.footer')).not.toBeVisible();
  });

  test('Scenario 2.2: Rapidly adding and deleting items', async ({ page }) => {
    // 1. Type "Fast Task" and press Enter.
    const todoInput = page.getByPlaceholder('What needs to be done?');
    await todoInput.fill('Fast Task');
    await todoInput.press('Enter');

    // 2. Immediately locate the new item and click its delete button.
    const fastTask = page.getByTestId('todo-item').filter({ hasText: 'Fast Task' });
    await fastTask.hover();
    await fastTask.getByRole('button', { name: 'Delete' }).click();

    // Expected Outcomes:
    // - The item is removed.
    await expect(page.getByTestId('todo-item')).toHaveCount(0);
    // - The footer becomes hidden again.
    await expect(page.locator('.footer')).not.toBeVisible();
  });
});

test.describe('3. Negative Testing Scenarios', () => {
  test('Scenario 3.1: Attempting to find delete button without hover (Accessibility/Structure)', async ({ page }) => {
    // 1. Type "Hidden Delete" and press Enter.
    const todoInput = page.getByPlaceholder('What needs to be done?');
    await todoInput.fill('Hidden Delete');
    await todoInput.press('Enter');

    // 2. Without dispatching a hover event on the li, attempt to locate the delete button
    // Note: Since it is `display: none` by default, it is removed from the accessibility tree,
    // so `getByRole` will not find it. We must use a structural locator like `.destroy`.
    const deleteButton = page.getByTestId('todo-item').first().locator('.destroy');
    
    // Expected Outcomes:
    // - The button exists in the DOM but is visually hidden until hover
    await expect(deleteButton).toBeAttached();
    await expect(deleteButton).not.toBeVisible();
    
    // Verify it becomes visible upon hover
    await page.getByTestId('todo-item').first().hover();
    await expect(deleteButton).toBeVisible();
  });
});
