// spec: specs/add-new-todos-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Navigation handled as per the seed test context
  await page.goto('./');
});

test.describe('1. Happy Path Scenarios', () => {
  test('Scenario 1.1: Add a single valid todo', async ({ page }) => {
    // 1. Focus on the main input field ("What needs to be done?").
    const todoInput = page.getByPlaceholder('What needs to be done?');
    await todoInput.click();

    // 2. Type a standard string, e.g., "Buy groceries".
    await todoInput.fill('Buy groceries');

    // 3. Press the Enter key.
    await todoInput.press('Enter');

    // Expected Outcomes:
    // - The input field is cleared and ready for the next entry.
    await expect(todoInput).toBeEmpty();

    // - A new item "Buy groceries" appears in the todo list.
    const todoItem = page.getByTestId('todo-item').first();
    await expect(todoItem.getByTestId('todo-title')).toHaveText('Buy groceries');

    // - The item is unchecked by default.
    await expect(todoItem.getByRole('checkbox')).not.toBeChecked();

    // - The footer becomes visible and the item counter updates to "1 item left".
    await expect(page.locator('.footer')).toBeVisible();
    await expect(page.getByTestId('todo-count')).toHaveText('1 item left');
  });

  test('Scenario 1.2: Add multiple valid todos', async ({ page }) => {
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

    // Expected Outcomes:
    // - The list displays all three items in the order they were added
    const todoItems = page.getByTestId('todo-item');
    await expect(todoItems).toHaveCount(3);
    await expect(todoItems.nth(0).getByTestId('todo-title')).toHaveText('Task 1');
    await expect(todoItems.nth(1).getByTestId('todo-title')).toHaveText('Task 2');
    await expect(todoItems.nth(2).getByTestId('todo-title')).toHaveText('Task 3');

    // - The item counter in the footer updates to "3 items left".
    await expect(page.getByTestId('todo-count')).toHaveText('3 items left');
  });
});

test.describe('2. Edge Cases', () => {
  test('Scenario 2.1: Add a todo with leading/trailing whitespace', async ({ page }) => {
    // 1. Focus on the main input field.
    const todoInput = page.getByPlaceholder('What needs to be done?');
    await todoInput.click();

    // 2. Type "   Spaced out task   ".
    await todoInput.fill('   Spaced out task   ');

    // 3. Press the Enter key.
    await todoInput.press('Enter');

    // Expected Outcomes:
    // - The list displays a new item with the text "Spaced out task" (whitespace trimmed).
    const todoItem = page.getByTestId('todo-item').first();
    await expect(todoItem.getByTestId('todo-title')).toHaveText('Spaced out task');
  });

  test('Scenario 2.2: Add a todo with special characters and emojis', async ({ page }) => {
    // 1. Focus on the main input field.
    const todoInput = page.getByPlaceholder('What needs to be done?');
    await todoInput.click();

    // 2. Type "Buy 🍎 & 🍌 (100% organic!) @market".
    const complexText = 'Buy 🍎 & 🍌 (100% organic!) @market';
    await todoInput.fill(complexText);

    // 3. Press the Enter key.
    await todoInput.press('Enter');

    // Expected Outcomes:
    // - The item appears exactly as typed with all special characters and emojis preserved.
    const todoItem = page.getByTestId('todo-item').first();
    await expect(todoItem.getByTestId('todo-title')).toHaveText(complexText);
  });

  test('Scenario 2.3: Add an extremely long todo', async ({ page }) => {
    // 1. Type a continuous string of 200 characters in the main input field.
    const todoInput = page.getByPlaceholder('What needs to be done?');
    const longString = 'A'.repeat(200);
    await todoInput.fill(longString);

    // 2. Press the Enter key.
    await todoInput.press('Enter');

    // Expected Outcomes:
    // - The item is successfully added to the list.
    const todoItem = page.getByTestId('todo-item').first();
    await expect(todoItem.getByTestId('todo-title')).toHaveText(longString);

    // - The text is properly wrapped or truncated via CSS within the layout constraints
    // (Playwright verifies it is rendered and visible without throwing layout errors)
    await expect(todoItem).toBeVisible();
  });
});

test.describe('3. Negative Testing Scenarios', () => {
  test('Scenario 3.1: Attempt to add an empty todo', async ({ page }) => {
    // 1. Focus on the main input field.
    const todoInput = page.getByPlaceholder('What needs to be done?');
    await todoInput.click();

    // 2. Ensure the field is completely empty.
    await todoInput.fill('');

    // 3. Press the Enter key.
    await todoInput.press('Enter');

    // Expected Outcomes:
    // - No new item is added to the list.
    await expect(page.getByTestId('todo-item')).toHaveCount(0);

    // - The item counter remains unchanged (or the footer remains hidden if the list was 0).
    await expect(page.locator('.footer')).not.toBeVisible();
  });

  test('Scenario 3.2: Attempt to add a whitespace-only todo', async ({ page }) => {
    // test.fixme() added by the Healer agent because the application leaves the whitespace 
    // in the input field instead of clearing it as expected.
    //test.fixme();

    // 1. Focus on the main input field.
    const todoInput = page.getByPlaceholder('What needs to be done?');
    await todoInput.click();

    // 2. Type "     " (5 spaces).
    await todoInput.fill('     ');

    // 3. Press the Enter key.
    await todoInput.press('Enter');

    // Expected Outcomes:
    // - No new item is added to the list.
    await expect(page.getByTestId('todo-item')).toHaveCount(0);

    // - The input field is cleared.
    await expect(todoInput).toBeEmpty();
  });
});
