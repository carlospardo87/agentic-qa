import { test, expect } from '@playwright/test';

test.describe('NVA Community Seed', () => {
  test('seed', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header')).toBeVisible();
  });
});
