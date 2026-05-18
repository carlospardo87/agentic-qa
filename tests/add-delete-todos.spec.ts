// spec: specs/add-delete-todos-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';

test.beforeEach(async ({ page }) => {
  const todoPage = new TodoPage(page);
  await todoPage.goto();
});

test.describe('1. Happy Path Scenarios', () => {
  test('Scenario 1.1: Add and delete a single todo', async ({ page }) => {
    const todoPage = new TodoPage(page);

    // 1-2. Add task
    await todoPage.addTodo('Task to delete');
    const todoItem = todoPage.getTodoItem('Task to delete');
    await expect(todoItem.getByTestId('todo-title')).toHaveText('Task to delete');

    // 3-4. Delete task
    await todoPage.deleteTodo('Task to delete');

    // Expected Outcomes:
    await expect(todoPage.todoItems).toHaveCount(0);
    await expect(todoPage.footer).not.toBeVisible();
  });

  test('Scenario 1.2: Delete a specific todo from a list of multiple items', async ({ page }) => {
    const todoPage = new TodoPage(page);

    // 1-3. Add tasks
    await todoPage.addTodo('Task 1');
    await todoPage.addTodo('Task 2');
    await todoPage.addTodo('Task 3');

    // 4-5. Delete Task 2
    await todoPage.deleteTodo('Task 2');

    // Expected Outcomes:
    await expect(todoPage.todoItems).toHaveCount(2);
    await expect(todoPage.todoItems.nth(0).getByTestId('todo-title')).toHaveText('Task 1');
    await expect(todoPage.todoItems.nth(1).getByTestId('todo-title')).toHaveText('Task 3');
    await expect(todoPage.todoCount).toHaveText('2 items left');
  });
});

test.describe('2. Edge Cases', () => {
  test('Scenario 2.1: Delete all items one by one', async ({ page }) => {
    const todoPage = new TodoPage(page);

    // Add tasks
    await todoPage.addTodo('First');
    await todoPage.addTodo('Second');

    // Delete tasks
    await todoPage.deleteTodo('First');
    await todoPage.deleteTodo('Second');

    // Expected Outcomes:
    await expect(todoPage.todoItems).toHaveCount(0);
    await expect(todoPage.footer).not.toBeVisible();
  });

  test('Scenario 2.2: Rapidly adding and deleting items', async ({ page }) => {
    const todoPage = new TodoPage(page);

    // Add task
    await todoPage.addTodo('Fast Task');

    // Immediately delete it
    await todoPage.deleteTodo('Fast Task');

    // Expected Outcomes:
    await expect(todoPage.todoItems).toHaveCount(0);
    await expect(todoPage.footer).not.toBeVisible();
  });
});

test.describe('3. Negative Testing Scenarios', () => {
  test('Scenario 3.1: Attempting to find delete button without hover (Accessibility/Structure)', async ({ page }) => {
    const todoPage = new TodoPage(page);

    // 1. Add task
    await todoPage.addTodo('Hidden Delete');

    // 2. Locate the delete button without hover
    const todoItem = todoPage.getTodoItem('Hidden Delete');
    const deleteButton = todoItem.locator('.destroy');
    
    // Expected Outcomes:
    // - The button exists in the DOM but is visually hidden until hover
    await expect(deleteButton).toBeAttached();
    await expect(deleteButton).not.toBeVisible();
    
    // Verify it becomes visible upon hover
    await todoItem.hover();
    await expect(deleteButton).toBeVisible();
  });
});
