/**
 * EXAMPLE — dashboard.spec.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Demonstrates how tests consume the storageState saved by auth.setup.ts.
 *
 * Key point: none of these tests touch the login page.  The browser context
 * is initialised with the serialised cookies/localStorage snapshot, so the
 * first page.goto() lands directly on the authenticated route.
 *
 * Pattern shown:
 *   • Role-based test isolation  (admin vs. editor)
 *   • Shared authenticated context with test.use()
 *   • Tests that verify what each role CAN and CANNOT do (RBAC)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { test, expect } from '@playwright/test';
import { ADMIN_STATE_PATH, EDITOR_STATE_PATH } from './auth.setup';

// ─── Admin tests ──────────────────────────────────────────────────────────────
// All tests inside this describe block share the admin session.
// No individual test needs to log in — the context is pre-populated.

test.describe('Admin role', () => {
  // This single line replaces a beforeEach login flow in every test.
  test.use({ storageState: ADMIN_STATE_PATH });

  test('can access the admin panel', async ({ page }) => {
    await page.goto('/admin');

    // The admin panel is visible without being redirected to /login.
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.getByRole('heading', { name: 'Admin Panel' })).toBeVisible();
  });

  test('can delete a user', async ({ page }) => {
    await page.goto('/admin/users');

    await page.getByRole('row', { name: 'editor@example.com' })
              .getByRole('button', { name: 'Delete' })
              .click();

    await expect(page.getByText('User deleted successfully')).toBeVisible();
  });

  test('can publish an article', async ({ page }) => {
    await page.goto('/articles/draft-1');
    await page.getByRole('button', { name: 'Publish' }).click();

    await expect(page.getByText('Article published')).toBeVisible();
  });
});

// ─── Editor tests ─────────────────────────────────────────────────────────────
// Separate storageState → completely isolated browser context from the admin.
// Playwright spins up a fresh context per test anyway, but the STARTING STATE
// (cookies/localStorage) comes from a different snapshot file.

test.describe('Editor role', () => {
  test.use({ storageState: EDITOR_STATE_PATH });

  test('can edit an existing article', async ({ page }) => {
    await page.goto('/articles/1/edit');

    await page.getByLabel('Title').fill('Updated title');
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByText('Saved')).toBeVisible();
  });

  test('cannot access the admin panel (RBAC check)', async ({ page }) => {
    await page.goto('/admin');

    // Editor should be redirected away or shown a 403 — not reach the panel.
    await expect(page).not.toHaveURL(/\/admin/);
    // Common patterns: redirect to /dashboard or show an "Access denied" message.
    const isDenied =
      (await page.getByText('Access denied').isVisible()) ||
      (await page.url().includes('/dashboard'));

    expect(isDenied).toBe(true);
  });

  test('cannot delete a user (RBAC check)', async ({ page }) => {
    await page.goto('/admin/users');

    // The Delete button must not exist in the editor's view.
    await expect(
      page.getByRole('button', { name: 'Delete' }).first(),
    ).not.toBeVisible();
  });
});

// ─── Why this pattern matters ─────────────────────────────────────────────────
//
//  WITHOUT storageState:
//    50 tests × 1 login each = 50 HTTP requests to /api/auth/login
//    → slower suite, rate-limiting risk, flaky if auth server is slow
//
//  WITH storageState:
//    2 logins total (one per role in auth.setup.ts), then pure localStorage
//    restore for every test — no network call, no UI interaction, < 5 ms overhead
//
//  Additional benefits:
//    • Works with OAuth / SSO / 2FA — you authenticate once (even manually
//      if needed) and every automated test reuses that valid session.
//    • CI-friendly — store the JSON as a CI artifact and reuse across jobs.
//    • Role isolation is explicit and visible — each describe block declares
//      exactly WHICH identity it runs under.
