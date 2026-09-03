import { test, expect } from '@playwright/test';

test.describe('NVA Community Seed', () => {
  test('seed', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header')).toBeVisible();
  });
});


/**
 * IMPORTANCE OF THE SEED FILE (`seed.spec.ts`):
 *
 * 1. BS-CONTEXT FOR AGENTS:
 *    Playwright Test Agents (such as the Planner, Generator, and Healer) rely heavily on this seed file.
 *    It acts as the "bootstrap execution context" to safely initialize live browser sessions.
 *
 * 2. REUSABLE STATE INITIALIZATION:
 *    This file should ideally set up and verify all essential global state, including layouts, cookies, 
 *    base URLs, and core layouts (e.g., verifying that the header is visible).
 *
 * 3. NO MANUAL DELAYS:
 *    Always avoid manual wait delays (e.g., `page.waitForTimeout()`) in this script, as it interferes
 *    with automated tooling and agent healing mechanisms.
 *
 * 4. VERIFICATION BASELINE:
 *    By verifying fundamental page elements, it ensures standard test suites can execute starting
 *    from a known-good surface layer.
 */
// This test verifies that the header is visible on the NVA Community Seed page.