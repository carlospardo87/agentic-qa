/**
 * EXAMPLE — playwright.config.example.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Shows how to wire up the auth.setup.ts pattern in a real project config.
 *
 * This file is for reference only — it is NOT loaded by Playwright.
 * The active config for this project is playwright.config.ts at the root.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,

  use: {
    baseURL: 'https://your-app.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [

    // ── 1. SETUP PROJECT ────────────────────────────────────────────────────
    // Runs auth.setup.ts once, before any browser project starts.
    // Produces playwright/.auth/admin.json and playwright/.auth/editor.json.
    //
    // Why a dedicated project instead of a beforeAll hook?
    //   • beforeAll runs per-file, so if you have 30 spec files you get 30 logins.
    //   • A setup PROJECT runs exactly once for the entire suite, then every
    //     test that needs auth loads the JSON snapshot (< 5 ms, no network call).
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,   // matches auth.setup.ts (and any future *.setup.ts)
      use: {
        // Setup runs without a pre-existing storageState (always a fresh context).
        storageState: { cookies: [], origins: [] },
      },
    },

    // ── 2. CHROMIUM — AUTHENTICATED TESTS ───────────────────────────────────
    // Tests that call `test.use({ storageState: ADMIN_STATE_PATH })` or
    // `test.use({ storageState: EDITOR_STATE_PATH })` run here.
    // The `dependencies` guarantee setup has finished before this project starts.
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /.*\.setup\.ts/,    // setup files are NOT regular tests
      dependencies: ['setup'],        // wait for setup project to complete
    },

    // ── 3. CHROMIUM — UNAUTHENTICATED / PUBLIC TESTS ────────────────────────
    // Some tests (login page, marketing pages, 404s) should NOT start with a
    // session.  Put them in a separate project with no storageState and no
    // dependency on setup, so they always run against a truly anonymous context.
    {
      name: 'chromium-public',
      use: {
        ...devices['Desktop Chrome'],
        storageState: { cookies: [], origins: [] }, // force anonymous context
      },
      testMatch: /.*\.public\.spec\.ts/,  // only files named *.public.spec.ts
    },

    // ── 4. MULTI-BROWSER (optional, usually for CI only) ────────────────────
    // Firefox and WebKit can reuse the same storageState files produced by
    // the Chromium-based setup project — session cookies are browser-agnostic.
    /*
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testIgnore: /.*\.setup\.ts/,
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: /.*\.setup\.ts/,
      dependencies: ['setup'],
    },
    */
  ],
});

// ─── Recommended .gitignore additions ────────────────────────────────────────
//
//   playwright/.auth/         ← serialised sessions (may contain real tokens)
//   playwright-report/
//   test-results/
//   blob-report/
//   playwright/.cache/
//
// ─── Recommended folder layout for a project with auth ───────────────────────
//
//   playwright.config.ts
//   tests/
//     auth.setup.ts           ← login seeds (matched by testMatch in setup project)
//     dashboard.spec.ts       ← authenticated tests
//     login.public.spec.ts    ← unauthenticated tests (matched by chromium-public)
//   pages/
//     LoginPage.ts            ← Page Object for the login form
//     DashboardPage.ts
//   playwright/
//     .auth/                  ← gitignored — JSON state files live here
//       admin.json
//       editor.json
