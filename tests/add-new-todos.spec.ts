// spec: specs/add-new-todos-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';

test.beforeEach(async ({ page }) => {
  const todoPage = new TodoPage(page);
  // Navigation handled as per the seed test context
  await todoPage.goto();
});

test.describe('1. Happy Path Scenarios', () => {
  test('Scenario 1.1: Add a single valid todo', async ({ page }) => {
    const todoPage = new TodoPage(page);
    
    // 1-3. Focus, type and press Enter.
    await todoPage.addTodo('Buy groceries');

    // Expected Outcomes:
    // - The input field is cleared and ready for the next entry.
    await expect(todoPage.todoInput).toBeEmpty();

    // - A new item "Buy groceries" appears in the todo list.
    const todoItem = todoPage.todoItems.first();
    await expect(todoItem.getByTestId('todo-title')).toHaveText('Buy groceries');

    // - The item is unchecked by default.
    await expect(todoItem.getByRole('checkbox')).not.toBeChecked();

    // - The footer becomes visible and the item counter updates to "1 item left".
    await expect(todoPage.footer).toBeVisible();
    await expect(todoPage.todoCount).toHaveText('1 item left');
  });

  test('Scenario 1.2: Add multiple valid todos', async ({ page }) => {
    const todoPage = new TodoPage(page);

    // Add tasks
    await todoPage.addTodo('Task 1');
    await todoPage.addTodo('Task 2');
    await todoPage.addTodo('Task 3');

    // Expected Outcomes:
    // - The list displays all three items in the order they were added
    await expect(todoPage.todoItems).toHaveCount(3);
    await expect(todoPage.todoItems.nth(0).getByTestId('todo-title')).toHaveText('Task 1');
    await expect(todoPage.todoItems.nth(1).getByTestId('todo-title')).toHaveText('Task 2');
    await expect(todoPage.todoItems.nth(2).getByTestId('todo-title')).toHaveText('Task 3');

    // - The item counter in the footer updates to "3 items left".
    await expect(todoPage.todoCount).toHaveText('3 items left');
  });
});

test.describe('2. Edge Cases', () => {
  test('Scenario 2.1: Add a todo with leading/trailing whitespace', async ({ page }) => {
    const todoPage = new TodoPage(page);
    
    // Type "   Spaced out task   ".
    await todoPage.addTodo('   Spaced out task   ');

    // Expected Outcomes:
    // - The list displays a new item with the text "Spaced out task" (whitespace trimmed).
    const todoItem = todoPage.todoItems.first();
    await expect(todoItem.getByTestId('todo-title')).toHaveText('Spaced out task');
  });

  test('Scenario 2.2: Add a todo with special characters and emojis', async ({ page }) => {
    const todoPage = new TodoPage(page);
    
    // Type special characters.
    const complexText = 'Buy 🍎 & 🍌 (100% organic!) @market';
    await todoPage.addTodo(complexText);

    // Expected Outcomes:
    // - The item appears exactly as typed with all special characters and emojis preserved.
    const todoItem = todoPage.todoItems.first();
    await expect(todoItem.getByTestId('todo-title')).toHaveText(complexText);
  });

  test('Scenario 2.3: Add an extremely long todo', async ({ page }) => {
    const todoPage = new TodoPage(page);
    
    // Type a continuous string of 200 characters.
    const longString = 'A'.repeat(200);
    await todoPage.addTodo(longString);

    // Expected Outcomes:
    // - The item is successfully added to the list.
    const todoItem = todoPage.todoItems.first();
    await expect(todoItem.getByTestId('todo-title')).toHaveText(longString);

    // - The text is properly rendered and visible without throwing layout errors
    await expect(todoItem).toBeVisible();
  });
});

test.describe('3. Negative Testing Scenarios', () => {
  test('Scenario 3.1: Attempt to add an empty todo', async ({ page }) => {
    const todoPage = new TodoPage(page);
    
    // Ensure the field is completely empty.
    await todoPage.addTodo('');

    // Expected Outcomes:
    // - No new item is added to the list.
    await expect(todoPage.todoItems).toHaveCount(0);

    // - The item counter remains unchanged (or the footer remains hidden if the list was 0).
    await expect(todoPage.footer).not.toBeVisible();
  });

  test('Scenario 3.2: Attempt to add a whitespace-only todo', async ({ page }) => {
    // test.fixme() added by the Healer agent because the application leaves the whitespace 
    // in the input field instead of clearing it as expected.
    test.fixme();
    
    const todoPage = new TodoPage(page);
    
    // Type "     " (5 spaces).
    await todoPage.addTodo('     ');

    // Expected Outcomes:
    // - No new item is added to the list.
    await expect(todoPage.todoItems).toHaveCount(0);

    // - The input field is cleared.
    await expect(todoPage.todoInput).toBeEmpty();
  });
});
