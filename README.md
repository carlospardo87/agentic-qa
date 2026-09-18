# 🎭 Playwright Test Agents POC

[![Playwright Version](https://img.shields.io/badge/Playwright-v1.60.0+-2e8b57.svg?style=flat-square&logo=playwright)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-ES2022-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg?style=flat-square)](LICENSE)

A Proof of Concept showing how AI agents — **Planner, Generator, Healer, Auditor, and Reporter** — can plan, generate, maintain, repair, audit, and report on Playwright end-to-end tests with minimal human effort, powered by GitHub Copilot and the MCP protocol inside VS Code.

> 📖 For the full architecture — agent workflow diagram, MCP tools, and design rationale — see [docs/agents-architecture.md](docs/agents-architecture.md).

---

## 📋 Table of Contents

1. [Prerequisites](#-prerequisites)
2. [First-Time Setup](#-first-time-setup)
3. [MCP Configuration (required for agents)](#-mcp-configuration-required-for-agents)
4. [How to Use Each Agent](#-how-to-use-each-agent)
   - [Planner Agent](#1--planner-agent)
   - [Generator Agent](#2--generator-agent)
   - [Healer Agent](#3--healer-agent)
   - [Auditor Agent](#4--auditor-agent)
   - [Reporter Agent](#5--reporter-agent)
5. [Prompt Writing Tips](#-prompt-writing-tips)
6. [Running Tests Manually](#-running-tests-manually)
7. [Project Structure](#-project-structure)
8. [Architecture Reference](#-architecture-reference)

---

## ✅ Prerequisites

Before you start, make sure you have the following installed and configured:

| Requirement | Version | Notes |
|---|---|---|
| [Node.js](https://nodejs.org/) | 18+ | LTS recommended |
| [VS Code](https://code.visualstudio.com/) | Latest | Required for agent integration |
| [GitHub Copilot extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) | Latest | Paid subscription needed |
| [GitHub Copilot Chat extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat) | Latest | Enables agent mode |
| Atlassian account | — | Only needed for Jira-driven workflows (Planner reading a ticket, Reporter posting a comment) |

> **Why VS Code + Copilot?** The agents in this project are defined as `.agent.md` files under `.github/agents/`. They run inside VS Code Copilot Chat in **Agent mode** and communicate with the browser and with Jira via the two MCP servers configured in `.vscode/mcp.json`.

---

## 🚀 First-Time Setup

Follow these steps exactly after cloning the repository:

### Step 1 — Clone the repository

```bash
git clone <repository-url>
cd auto-poc
```

### Step 2 — Install Node dependencies

```bash
npm install
```

### Step 3 — Install Playwright browsers

```bash
npx playwright install
```

This downloads the Chromium (and optionally Firefox/WebKit) browsers that Playwright needs to run tests and for the agents to interact with the app.

### Step 4 — Point the tests at your application

`baseURL` in [playwright.config.ts](playwright.config.ts) defaults to `http://localhost:3000`. Set it to your own app's URL either by editing the file directly, or by exporting the `BASE_URL` environment variable before running tests:

```bash
export BASE_URL=https://your-app.example.com
```

### Step 5 — Open the project in VS Code

```bash
code .
```

Make sure the **GitHub Copilot** and **GitHub Copilot Chat** extensions are installed and you are signed in.

### Step 6 — Trust the MCP servers

When VS Code opens, you may see notifications asking you to allow the MCP servers defined in `.vscode/mcp.json` (`playwright-test` and `com.atlassian/atlassian-mcp-server`). Click **Allow** (or **Start**) to enable them. The Playwright server activates the browser automation tools the agents use; the Atlassian server enables the Jira-driven workflows (Planner reading a ticket, Reporter posting a comment) and will prompt you to sign in with your Atlassian account on first use.

If you do not see the notification:
1. Open the Command Palette (`Cmd+Shift+P` on macOS / `Ctrl+Shift+P` on Windows/Linux)
2. Run **MCP: List Servers** and verify that `playwright-test` and `com.atlassian/atlassian-mcp-server` both show as **Running**.

### Step 7 — Verify the setup

Run the existing tests to confirm everything is working:

```bash
npx playwright test
```

Open the HTML report to see results:

```bash
npx playwright show-report
```

---

## 🔌 MCP Configuration (required for agents)

The `.vscode/mcp.json` file is already included in the repository and configures both MCP servers automatically:

```json
{
  "servers": {
    "playwright-test": {
      "type": "stdio",
      "command": "npx",
      "args": ["playwright", "run-test-mcp-server"]
    },
    "com.atlassian/atlassian-mcp-server": {
      "type": "http",
      "url": "https://mcp.atlassian.com/v1/mcp"
    }
  },
  "inputs": []
}
```

| Server | Purpose |
|---|---|
| `playwright-test` | Gives agents live browser control (click, type, snapshot, run tests) |
| `com.atlassian/atlassian-mcp-server` | Gives the Planner and Reporter agents access to Jira (`getJiraIssue`, `addCommentToJiraIssue`) |

> No manual configuration is needed — just open the project in VS Code and accept the MCP prompt(s). The first time you use a Jira-driven workflow, VS Code will prompt you to sign in to your Atlassian account.
> Without Jira access, the Planner still works from a plain-text description and the Reporter falls back to printing the summary in chat instead of posting it as a comment.

---

## 🤖 How to Use Each Agent

All agents are invoked through **GitHub Copilot Chat** in VS Code. To open it:
- Press `Cmd+Shift+I` (macOS) / `Ctrl+Shift+I` (Windows/Linux)
- Or click the **Copilot Chat** icon in the Activity Bar

Switch to **Agent mode** by clicking the mode selector at the top of the chat panel and choosing **Agent**.

---

### 1. 🗺️ Planner Agent

**Purpose**: Explores the live application and generates a structured Markdown test plan. Can optionally start from a Jira ticket's acceptance criteria instead of a plain-text description. Critically, it also **screens every scenario for automation suitability** before writing it down.

**When to use**: You want to create a new set of test scenarios for a feature you haven't tested yet.

**How to invoke**:

1. Open Copilot Chat in Agent mode.
2. Select the agent: type `@playwright-test-planner` or select it from the agent picker.
3. Write a prompt describing what you want to test, or reference a Jira ticket key. Example:

   ```
   @playwright-test-planner Plan the end-to-end scenarios for the todo filtering feature.
   ```

4. The agent will open a browser, navigate the app, explore interactions, validate any
   acceptance criteria against observed behavior (flagging ambiguous or contradictory
   ones instead of guessing), and save a new Markdown plan to `specs/`.

**Automation screening**: every scenario is judged against five criteria — determinism,
UI stability, execution frequency, technical feasibility, and risk/business value — and
labeled either `✅ Yes` (automation candidate) or `⚠️ Manual/Exploratory only`. Only
`✅ Yes` scenarios are later implemented by the Generator; `⚠️` scenarios stay in the plan
for human execution. A summary table at the top of the plan lists every scenario next to
its verdict and one-line rationale.

**Output**: A new file in `specs/`, e.g., `specs/filter-todos-plan.md`.

---

### 2. ⚙️ Generator Agent

**Purpose**: Reads a Markdown test plan from `specs/` and generates a runnable Playwright `.spec.ts` file — but only for scenarios the Planner already marked `✅ Yes`.

**When to use**: A plan exists in `specs/` and you need to turn it into actual test code.

**How to invoke**:

1. Open Copilot Chat in Agent mode.
2. Select `@playwright-test-generator`.
3. Reference the plan you want to convert. Example:

   ```
   @playwright-test-generator Generate tests from specs/filter-todos-plan.md
   ```

4. The agent reads the plan, **skips any scenario marked `⚠️ Manual/Exploratory only`**
   (or unlabeled), verifies each step of the remaining `✅ Yes` scenarios live in the
   browser, writes the test file to `tests/`, and **runs it immediately to confirm it
   passes** before reporting it as done.
5. If a generated test fails, the agent distinguishes its own authoring mistakes (fixed
   with one self-correction attempt) from genuine selector/DOM or app-behavior issues,
   which are left as-is and flagged for the Healer agent instead of being force-fixed.

**Output**: A new file in `tests/`, e.g., `tests/filter-todos.spec.ts`, plus a run summary
split into three groups: **Generated & passing**, **Generated but failing** (needs Healer),
and **Skipped** (manual/exploratory or unlabeled scenarios, with the reason for each).

---

### 3. 🩺 Healer Agent

**Purpose**: Diagnoses and fixes failing tests by re-inspecting the DOM and updating broken selectors or assertions.

**When to use**: A test that previously passed is now failing after a UI change.

**How to invoke**:

1. Run your tests first to identify the failure:

   ```bash
   npx playwright test
   ```

2. Open Copilot Chat in Agent mode.
3. Select `@playwright-test-healer`.
4. Describe the failing test. Example:

   ```
   @playwright-test-healer The test "filter active todos" in tests/filter-todos.spec.ts is failing. Fix it.
   ```

5. The agent replays the failing steps, captures page snapshots, finds the updated selectors, and patches the test file — within a **hard cap of 3 diagnosis-and-fix attempts per test**.
6. Every fix (or non-fix) leaves a dated inline comment (e.g. `// healed 2026-08-20: ...`)
   explaining what changed and why. If the agent is confident the app itself is broken
   rather than the test, or the attempt cap is reached with no clear verdict, it marks
   the test `test.fixme()` instead of forcing a pass, and states plainly whether that's a
   confirmed regression or an inconclusive diagnosis needing human investigation.

**Output**: Updated `tests/*.spec.ts` with corrected locators/assertions, or a `test.fixme()`
skip with an explanatory comment when the test shouldn't be forced to pass.

---

### 4. �️ Auditor Agent

**Purpose**: A read-only quality gate that checks whether each generated test **actually validates** its scenario, rather than just passing. It catches "ghost tests" that click around but never assert anything meaningful.

**When to use**: After a Generator (or Healer) run, before reporting results — to confirm the green tests are trustworthy.

**How to invoke**:

1. Open Copilot Chat in Agent mode.
2. Select `@playwright-test-auditor`.
3. Reference the plan and the generated tests. Example:

   ```
   @playwright-test-auditor Audit the tests generated from specs/filter-todos-plan.md.
   ```

4. For each `✅ Yes` scenario, the agent reads the corresponding test and checks it against six criteria — real assertion, targets the scenario's expected result, asserts user-facing behavior (not CSS/internal IDs), resilient accessible locators, no hard-coded waits, and 1:1 mapping to the plan. It never runs, edits, or fixes tests.

**Report format**: two scannable tables — a **verdict count** table and a **per-scenario detail** table classifying each test as `✅ Solid`, `⚠️ Weak` (ghost/mis-targeted/fragile), or `❌ Missing`. Weak and missing tests are routed back to the Generator; well-written but genuinely broken ones go to the Healer.

**Output**: An audit report in chat. Nothing is written to disk or posted to Jira.

---

### 5. �📣 Reporter Agent

**Purpose**: Summarizes a test generation/healing run — including any selectors that were healed or tests skipped with `test.fixme()` — and posts the summary as a comment on the originating Jira ticket.

**When to use**: After a Generator or Healer run is complete and you want the results (pass/fail per scenario, healing notes, unresolved acceptance-criteria ambiguities) recorded back on the Jira ticket that started the work.

**How to invoke**:

1. Open Copilot Chat in Agent mode.
2. Select `@playwright-test-reporter`.
3. Reference the spec/plan and the Jira ticket key. Example:

   ```
   @playwright-test-reporter Summarize the test run for specs/filter-todos-plan.md and post the results to NVAMSP-XXXX.
   ```

4. The agent never generates, fixes, or re-runs tests itself — it only reads existing test results and files, then posts a Jira comment.

**Report format**: the comment always contains up to three tables — a **summary count**
table (Passing / Healed / Skipped / Not yet run / Waiting for human review), an
**automated scenario detail** table (one row per `✅ Yes` scenario with its test file and
status, including healer notes where relevant), and a **manual/exploratory scenario
detail** table (one row per `⚠️` scenario, always shown as ⏳ *Waiting for human review* —
never Pass/Fail, since this agent has no way to know what a human has already checked).

**Output**: A comment posted on the referenced Jira ticket.

---

## 💬 Prompt Writing Tips

| Principle | Why it matters |
|---|---|
| **Be specific about scope** | Name the feature, page, or user flow explicitly, and where to save the output. |
| **Mention the starting state** | Tell the agent whether to start fresh or use a seeded state (`seed.spec.ts`). |
| **One responsibility per prompt** | Don't ask the Planner to also generate code, or the Healer to add new features. Chain agents one at a time. |
| **Provide failure details to the Healer** | Include the test name, file path, and the error message so it can diagnose faster. |

**Example — Planner:**
```
@playwright-test-planner
Plan the end-to-end scenarios for the todo filtering feature (All / Active / Completed),
including empty-list and all-completed edge cases.
Save the plan to specs/filter-todos-plan.md.
```

**Example — Planner (from a Jira ticket):**
```
@playwright-test-planner
Read Jira ticket NVAMSP-XXXX (https://your-domain.atlassian.net/browse/NVAMSP-XXXX)
via Jira MCP and generate a test plan in specs/NVAMSP-XXXX.md.
```
> Always include the ticket key (and link, if you have it) — without it the Planner cannot look up the acceptance criteria via Jira MCP.

**Example — Generator:**
```
@playwright-test-generator
Generate Playwright tests from specs/filter-todos-plan.md.
Use accessible locators (getByRole, getByPlaceholder, getByLabel) wherever possible.
Save the output to tests/filter-todos.spec.ts.
```

**Example — Healer:**
```
@playwright-test-healer
The test "should filter active todos" in tests/filter-todos.spec.ts is failing with:
  Error: locator('.filters a').filter({ hasText: 'Active' }) — strict mode violation, 2 elements found.
Fix the locator.
```

**Example — Auditor:**
```
@playwright-test-auditor
Audit the tests generated from specs/filter-todos-plan.md.
Flag any ghost tests, mis-targeted assertions, or fragile locators.
```

**Example — Reporter:**
```
@playwright-test-reporter
Summarize the test run for specs/filter-todos-plan.md and post the results to NVAMSP-XXXX.
```

### 🎯 Worked example: Jira-driven, end-to-end (NVAMSP-XXXX)

1. **Planner** — `Read Jira ticket NVAMSP-XXXX via Jira MCP and generate a test plan in specs/NVAMSP-XXXX.md. Flag any ambiguous acceptance criteria instead of guessing.`
2. **Generator** — `Generate Playwright tests from specs/NVAMSP-XXXX.md. Verify selectors against the live DOM and run each test to confirm it passes before reporting it as done.`
3. **Healer** — `Run the healer agent on the failing test(s) from the NVAMSP-XXXX suite. Distinguish selector/DOM drift from real regressions; skip (test.fixme()) instead of forcing a pass.`
4. **Auditor** — `Audit the NVAMSP-XXXX tests against the plan. Flag ghost tests, mis-targeted assertions, or fragile locators before reporting.`
5. **Reporter** — `Summarize the NVAMSP-XXXX test run, including any healing that occurred, and post it as a comment on the Jira ticket.`

---

## 🧪 Running Tests Manually

| Command | Description |
|---|---|
| `npx playwright test` | Run the full test suite |
| `npx playwright test tests/add-new-todos.spec.ts` | Run a single spec file |
| `npx playwright test --headed` | Run with browser visible |
| `npx playwright test --debug` | Run in debug/step mode |
| `npx playwright show-report` | Open the last HTML report |

The base URL used by all tests is defined in [playwright.config.ts](playwright.config.ts) via `baseURL` (overridable with the `BASE_URL` environment variable).

---

## 📁 Project Structure

```
auto-poc/
├── .github/
│   ├── agents/
│   │   ├── playwright-test-planner.agent.md    # Planner agent definition
│   │   ├── playwright-test-generator.agent.md  # Generator agent definition
│   │   ├── playwright-test-healer.agent.md     # Healer agent definition
│   │   ├── playwright-test-auditor.agent.md    # Auditor agent definition
│   │   └── playwright-test-reporter.agent.md   # Reporter agent definition
│   └── workflows/
│       └── copilot-setup-steps.yml            # CI setup and test workflow
├── .vscode/
│   └── mcp.json                 # MCP server config (pre-configured, no edits needed)
├── docs/
│   └── agents-architecture.md  # Deep-dive architecture documentation
├── specs/
│   └── README.md               # How to write test plans
├── tests/
│   └── seed.spec.ts             # Base smoke test used by agents
├── playwright.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

> `playwright-report/` and `test-results/` are generated at runtime and excluded from git.

---

## 📖 Architecture Reference

For a detailed explanation of how the agents interact, the MCP bridge, and best practices, see [docs/agents-architecture.md](docs/agents-architecture.md).

Key concepts covered:
- Agent workflow diagram (Planner → Generator → Healer → Reporter)
- MCP tools exposed to the LLM
- The role of `seed.spec.ts` as a bootstrap context
- Best practices: selector strategy, avoiding hard-coded timeouts, auditing agent output

---

## 📄 License

This project is available under the [MIT License](LICENSE).
