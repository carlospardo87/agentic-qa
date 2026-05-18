import { test, expect } from '@playwright/test';

test.describe('TodoMVC Seed', () => {
  test('seed', async ({ page }) => {
    // Navigate to the TodoMVC base URL
    await page.goto('./');
    
    // Verify that the header title is visible
    await expect(page.locator('h1')).toHaveText('todos');
    
    // Verify that the main todo input is ready
    const todoInput = page.getByPlaceholder('What needs to be done?');
    await expect(todoInput).toBeVisible();
  });
});
