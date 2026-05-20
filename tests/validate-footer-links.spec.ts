// spec: specs/validate-footer-links-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./');
});

test.describe('Footer Link Navigation', () => {
  test('Scenario 1.1: Validate clicking the Created by author link', async ({ page }) => {
    const footer = page.locator('footer.info');
    const createdByLink = footer.getByRole('link', { name: 'Remo H. Jansen' });

    // 1. Open the TodoMVC application and ensure the footer attribution section is visible.
    await expect(footer).toBeVisible();
    await expect(page.getByText('Created by Remo H. Jansen')).toBeVisible();
    await expect(createdByLink).toBeVisible();

    // 2. Click the 'Remo H. Jansen' footer link.
    await Promise.all([
      page.waitForURL(/github\.com\/remojansen/),
      createdByLink.click(),
    ]);

    // expect: The browser navigates to the author URL containing 'github.com/remojansen'.
    await expect(page).toHaveURL(/github\.com\/remojansen/);
  });

  test('Scenario 1.2: Validate clicking the Part of TodoMVC link', async ({ page }) => {
    const footer = page.locator('footer.info');
    const todoMvcLink = footer.getByRole('link', { name: 'TodoMVC' });

    // 1. Open the TodoMVC application and ensure the footer attribution section is visible.
    await expect(footer).toBeVisible();
    await expect(page.getByText('Part of TodoMVC')).toBeVisible();
    await expect(todoMvcLink).toBeVisible();

    // 2. Click the 'TodoMVC' footer link.
    await Promise.all([
      page.waitForURL(/todomvc\.com/),
      todoMvcLink.click(),
    ]);

    // expect: The browser navigates to the project URL containing 'todomvc.com'.
    await expect(page).toHaveURL(/todomvc\.com/);
  });
});
