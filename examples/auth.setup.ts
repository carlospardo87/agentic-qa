/**
 * EXAMPLE — auth.setup.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * This file runs ONCE before any test project that declares it as a dependency.
 * It logs in with valid credentials, verifies the session is active, and then
 * serialises the browser's cookies + localStorage to a JSON file.
 *
 * Every subsequent test that loads that JSON will start already authenticated —
 * no login flow, no extra network round-trip to the auth server.
 *
 * HOW TO USE IN OTHER TESTS:
 *   import { ADMIN_STATE_PATH } from '../examples/auth.setup';
 *   test.use({ storageState: ADMIN_STATE_PATH });
 *
 * IMPORTANT: Add playwright/.auth/ to .gitignore — the JSON can contain
 * real session tokens and must never be committed to version control.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { test, expect } from '@playwright/test';
import path from 'path';

// ─── State file paths (one per role) ──────────────────────────────────────────
// Each role that needs its own session gets its own file.
// This lets you test role-based access control (RBAC) with isolated contexts.
export const ADMIN_STATE_PATH  = path.join(__dirname, '../playwright/.auth/admin.json');
export const EDITOR_STATE_PATH = path.join(__dirname, '../playwright/.auth/editor.json');
export const VIEWER_STATE_PATH = path.join(__dirname, '../playwright/.auth/viewer.json');

// ─── Credentials (read from environment variables, NEVER hardcoded) ───────────
// In CI, set these as secrets. Locally, use a .env file (add .env to .gitignore).
const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    ?? 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'supersecret';

const EDITOR_EMAIL    = process.env.EDITOR_EMAIL    ?? 'editor@example.com';
const EDITOR_PASSWORD = process.env.EDITOR_PASSWORD ?? 'editorsecret';

// ─── Helper ───────────────────────────────────────────────────────────────────
async function loginAndSave(
  page: import('@playwright/test').Page,
  email: string,
  password: string,
  statePath: string,
) {
  // 1. Navigate to the login page.
  await page.goto('/login');

  // 2. Fill credentials — use getByLabel/getByRole for resilience against
  //    HTML changes; avoid CSS/XPath selectors here.
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  // 3. Wait until the app confirms a successful login.
  //    Prefer waitForURL over a fixed timeout — it fails fast and accurately.
  await page.waitForURL('**/dashboard');

  // 4. Optional: assert something specific to the authenticated state
  //    so a broken login fails HERE (with a clear message) rather than
  //    inside unrelated tests.
  await expect(page.getByRole('navigation')).toBeVisible();

  // 5. Serialise cookies + localStorage → JSON.
  //    Playwright restores this snapshot instantly, bypassing the login UI
  //    entirely for every test that depends on this setup.
  await page.context().storageState({ path: statePath });
}

// ─── Setup tests (one per role) ───────────────────────────────────────────────

test('setup: authenticate as admin', async ({ page }) => {
  await loginAndSave(page, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_STATE_PATH);
});

test('setup: authenticate as editor', async ({ page }) => {
  await loginAndSave(page, EDITOR_EMAIL, EDITOR_PASSWORD, EDITOR_STATE_PATH);
});
