# 🎭 Playwright Test Agents POC

[![Playwright Version](https://img.shields.io/badge/Playwright-v1.60.0+-2e8b57.svg?style=flat-square&logo=playwright)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-ES2022-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg?style=flat-square)](LICENSE)

A Proof of Concept showing how four AI agents — **Planner, Generator, Refactor, and Healer** — can plan, generate, maintain, and repair Playwright end-to-end tests with minimal human effort, powered by GitHub Copilot and the MCP protocol inside VS Code.

---

## 📋 Table of Contents

1. [Prerequisites](#-prerequisites)
2. [First-Time Setup](#-first-time-setup)
3. [MCP Configuration (required for agents)](#-mcp-configuration-required-for-agents)
4. [How to Use Each Agent](#-how-to-use-each-agent)
   - [Planner Agent](#1--planner-agent)
   - [Generator Agent](#2--generator-agent)
   - [Refactor Agent](#3--refactor-agent)
   - [Healer Agent](#4--healer-agent)
5. [Running Tests Manually](#-running-tests-manually)
6. [Project Structure](#-project-structure)
7. [Architecture Reference](#-architecture-reference)

---

## ✅ Prerequisites

Before you start, make sure you have the following installed and configured:

| Requirement | Version | Notes |
|---|---|---|
| [Node.js](https://nodejs.org/) | 18+ | LTS recommended |
| [VS Code](https://code.visualstudio.com/) | Latest | Required for agent integration |
| [GitHub Copilot extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) | Latest | Paid subscription needed |
| [GitHub Copilot Chat extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat) | Latest | Enables agent mode |

> **Why VS Code + Copilot?** The agents in this project are defined as `.agent.md` files under `.github/agents/`. They run inside VS Code Copilot Chat in **Agent mode** and communicate with the browser via the MCP server bundled with Playwright.

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

### Step 4 — Open the project in VS Code

```bash
code .
```

Make sure the **GitHub Copilot** and **GitHub Copilot Chat** extensions are installed and you are signed in.

### Step 5 — Trust the MCP server

When VS Code opens, you may see a notification asking you to allow the MCP server defined in `.vscode/mcp.json`. Click **Allow** (or **Start**) to enable it. This activates the browser automation tools that the agents use.

If you do not see the notification:
1. Open the Command Palette (`Cmd+Shift+P` on macOS / `Ctrl+Shift+P` on Windows/Linux)
2. Run **MCP: List Servers** and verify that `playwright-test` and `filesystem` show as **Running**.

### Step 6 — Verify the setup

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

The `.vscode/mcp.json` file is already included in the repository and configures two MCP servers automatically:

```json
{
  "servers": {
    "playwright-test": {
      "type": "stdio",
      "command": "npx",
      "args": ["playwright", "run-test-mcp-server"]
    },
    "filesystem": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."]
    }
  }
}
```

| Server | Purpose |
|---|---|
| `playwright-test` | Gives agents live browser control (click, type, snapshot, run tests) |
| `filesystem` | Lets agents read and write spec and test files in the workspace |

> No manual configuration is needed — just open the project in VS Code and accept the MCP prompt.

---

## 🤖 How to Use Each Agent

All agents are invoked through **GitHub Copilot Chat** in VS Code. To open it:
- Press `Cmd+Shift+I` (macOS) / `Ctrl+Shift+I` (Windows/Linux)
- Or click the **Copilot Chat** icon in the Activity Bar

Switch to **Agent mode** by clicking the mode selector at the top of the chat panel and choosing **Agent**.

---

### 1. 🗺️ Planner Agent

**Purpose**: Explores the live application and generates a structured Markdown test plan.

**When to use**: You want to create a new set of test scenarios for a feature you haven't tested yet.

**How to invoke**:

1. Open Copilot Chat in Agent mode.
2. Select the agent: type `@playwright-test-planner` or select it from the agent picker.
3. Write a prompt describing what you want to test. Example:

   ```
   @playwright-test-planner Plan the end-to-end scenarios for the todo filtering feature.
   ```

4. The agent will open a browser, navigate the app, explore interactions, and save a new Markdown plan to `specs/`.

**Output**: A new file in `specs/`, e.g., `specs/filter-todos-plan.md`.

---

### 2. ⚙️ Generator Agent

**Purpose**: Reads a Markdown test plan from `specs/` and generates a runnable Playwright `.spec.ts` file.

**When to use**: A plan exists in `specs/` and you need to turn it into actual test code.

**How to invoke**:

1. Open Copilot Chat in Agent mode.
2. Select `@playwright-test-generator`.
3. Reference the plan you want to convert. Example:

   ```
   @playwright-test-generator Generate tests from specs/filter-todos-plan.md
   ```

4. The agent reads the plan, verifies each step live in the browser, and writes the test file to `tests/`.

**Output**: A new file in `tests/`, e.g., `tests/filter-todos.spec.ts`.

---

### 3. 🔧 Refactor Agent

**Purpose**: Refactors existing `.spec.ts` files to use the **Page Object Model (POM)** pattern.

**When to use**: Tests exist but have inline selectors and logic that should be extracted into a reusable page object class.

**How to invoke**:

1. Open Copilot Chat in Agent mode.
2. Select `@playwright-test-refactor`.
3. Point it at the test file to refactor. Example:

   ```
   @playwright-test-refactor Refactor tests/filter-todos.spec.ts to use the Page Object Model.
   ```

4. The agent creates or updates a class in `pages/` and rewrites the spec to use it.

**Output**: Updated `pages/TodoPage.ts` (or a new page object) and a cleaner `tests/*.spec.ts`.

---

### 4. 🩺 Healer Agent

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

5. The agent replays the failing steps, captures page snapshots, finds the updated selectors, and patches the test file.

**Output**: Updated `tests/*.spec.ts` with corrected locators and/or assertions.

---

## 💬 Prompt Examples & Best Practices

### Prompt writing principles

Before looking at examples, keep these rules in mind:

| Principle | Why it matters |
|---|---|
| **Be specific about scope** | Vague prompts produce vague plans. Name the feature, the page, or the user flow explicitly. |
| **Mention the starting state** | Tell the agent whether to start fresh or use a seeded state (`seed.spec.ts`). |
| **Specify the output location** | Tell the agent where to save the file to avoid misplaced output. |
| **Include edge cases explicitly** | Agents will cover happy paths by default; you must ask for error states, empty states, and boundary conditions. |
| **One responsibility per prompt** | Don't ask the Planner to also generate code, or the Generator to also refactor. Chain agents one at a time. |
| **Provide failure details to the Healer** | Always include the test name, file path, and the error message. The more context, the faster the fix. |

---

### 🗺️ Planner Agent — prompt examples

**Minimal (basic happy path):**
```
@playwright-test-planner
Plan the end-to-end scenarios to add and delete todo items on the TodoMVC app.
Save the plan to specs/add-delete-todos-plan.md.
```

**With edge cases and boundary conditions:**
```
@playwright-test-planner
Plan the end-to-end scenarios for the todo filtering feature (All / Active / Completed).
Include:
- Happy path: switching between filters with mixed todo states
- Edge case: filtering when the list is empty
- Edge case: filtering after completing all items
Save the plan to specs/filter-todos-plan.md.
```

**Starting from a seeded state:**
```
@playwright-test-planner
Using tests/seed.spec.ts as the starting state (3 pre-seeded todos, first one completed),
plan the scenarios for the "Clear completed" button behavior.
Cover: button visibility, button click, confirmation that active todos remain.
Save the plan to specs/clear-completed-todos-plan.md.
```

**Targeting a specific user role or flow:**
```
@playwright-test-planner
Plan the end-to-end scenarios for editing a todo item by double-clicking it.
Include:
- Successful edit and save with Enter key
- Successful edit and save by clicking outside the field
- Canceling an edit with Escape key
- Editing a todo and leaving the field blank (should delete the item)
Save the plan to specs/double-click-edit-todos-plan.md.
```

---

### ⚙️ Generator Agent — prompt examples

**Minimal:**
```
@playwright-test-generator
Generate Playwright tests from specs/filter-todos-plan.md.
Save the output to tests/filter-todos.spec.ts.
```

**With explicit locator strategy preference:**
```
@playwright-test-generator
Generate Playwright tests from specs/add-new-todos-plan.md.
Use accessible locators (getByRole, getByPlaceholder, getByLabel) wherever possible.
Avoid CSS class selectors.
Save the output to tests/add-new-todos.spec.ts.
```

**With POM awareness:**
```
@playwright-test-generator
Generate Playwright tests from specs/clear-completed-todos-plan.md.
Use the existing TodoPage class in pages/TodoPage.ts for any interactions
that are already modeled there. Add new methods to TodoPage if needed.
Save the output to tests/clear-completed-todos.spec.ts.
```

**Requesting independent test isolation:**
```
@playwright-test-generator
Generate Playwright tests from specs/double-click-edit-todos-plan.md.
Each test case must be independent: set up its own state and clean up after itself.
Do not rely on state left by a previous test.
Save the output to tests/double-click-edit-todos.spec.ts.
```

---

### 🔧 Refactor Agent — prompt examples

**Minimal:**
```
@playwright-test-refactor
Refactor tests/filter-todos.spec.ts to use the Page Object Model.
Create or update the page object class in pages/TodoPage.ts.
```

**With explicit method naming guidance:**
```
@playwright-test-refactor
Refactor tests/add-new-todos.spec.ts to use the Page Object Model.
Name page object methods using the action-object convention: addTodo(), deleteTodo(), getTodoCount().
Update pages/TodoPage.ts with the new methods and rewrite the spec to use them.
```

**Refactoring multiple specs at once:**
```
@playwright-test-refactor
Refactor all spec files in the tests/ folder to use the existing TodoPage class in pages/TodoPage.ts.
Extend TodoPage with any missing methods needed.
Keep all existing test names and assertions intact — only move selectors into the page object.
```

**After a Generator run, cleaning up inline selectors:**
```
@playwright-test-refactor
The newly generated tests/double-click-edit-todos.spec.ts has inline locators and repetitive page.locator() calls.
Extract them into pages/TodoPage.ts using meaningful method names.
The spec file should only contain test logic, no direct locator strings.
```

---

### 🩺 Healer Agent — prompt examples

**Minimal (with error message):**
```
@playwright-test-healer
The test "should filter active todos" in tests/filter-todos.spec.ts is failing with:
  Error: locator('.filters a').filter({ hasText: 'Active' }) — strict mode violation, 2 elements found.
Fix the locator.
```

**With full context (recommended format):**
```
@playwright-test-healer
Failing test: "should clear completed todos" in tests/clear-completed-todos.spec.ts
Error: TimeoutError: locator('button.clear-completed') exceeded timeout of 5000ms
Browser: Chromium

The "Clear completed" button no longer uses the class .clear-completed.
Inspect the current DOM, find the correct selector, and update the test.
```

**When the feature itself may be broken:**
```
@playwright-test-healer
The test "should show item count in footer" in tests/validate-footer-links.spec.ts has been failing for 2 days.
Error: Expected "2 items left" but received "".
Determine whether this is a selector issue or a genuine regression in the app.
If the app is broken, mark the test with test.fixme() and add a comment explaining why.
```

**Batch healing after a UI redesign:**
```
@playwright-test-healer
After a recent UI redesign, multiple tests are failing across tests/add-new-todos.spec.ts
and tests/add-delete-todos.spec.ts. The input field and delete button selectors have changed.
Run both spec files in debug mode, capture snapshots at each failure point,
find the new selectors, and update both files.
```

---

### Anti-patterns to avoid

```
# ❌ Too vague — agent has no idea what "the app" is or what to test
@playwright-test-planner Test the app.

# ❌ Mixed responsibilities — asking the Planner to write code
@playwright-test-planner Plan AND generate the tests for the filter feature.

# ❌ No file reference — Generator doesn't know which plan to use
@playwright-test-generator Generate tests for filtering.

# ❌ No error detail — Healer cannot diagnose without context
@playwright-test-healer Fix the broken tests.

# ❌ Asking the Healer to add new features instead of fixing failures
@playwright-test-healer The filter tests pass but I want more assertions. Add them.
```

---

## 🧪 Running Tests Manually

| Command | Description |
|---|---|
| `npx playwright test` | Run the full test suite |
| `npx playwright test tests/add-new-todos.spec.ts` | Run a single spec file |
| `npx playwright test --headed` | Run with browser visible |
| `npx playwright test --debug` | Run in debug/step mode |
| `npx playwright show-report` | Open the last HTML report |

The base URL used by all tests is `https://demo.playwright.dev/todomvc/#/`.  
To change it, edit the `baseURL` in [playwright.config.ts](playwright.config.ts).

---

## 📁 Project Structure

```
auto-poc/
├── .github/
│   └── agents/
│       ├── playwright-test-planner.agent.md    # Planner agent definition
│       ├── playwright-test-generator.agent.md  # Generator agent definition
│       ├── playwright-test-refactor.agent.md   # Refactor agent definition
│       └── playwright-test-healer.agent.md     # Healer agent definition
├── .vscode/
│   └── mcp.json                 # MCP server config (pre-configured, no edits needed)
├── docs/
│   └── agents-architecture.md  # Deep-dive architecture documentation
├── examples/
│   └── *.ts                    # Reference examples
├── pages/
│   └── TodoPage.ts             # Page Object Model class
├── specs/
│   ├── README.md               # How to write test plans
│   ├── add-new-todos-plan.md
│   ├── add-delete-todos-plan.md
│   ├── clear-completed-todos-plan.md
│   ├── double-click-edit-todos-plan.md
│   ├── filter-todos-plan.md
│   └── validate-footer-links-plan.md
├── tests/
│   ├── seed.spec.ts             # Base state setup used by agents and other tests
│   ├── add-new-todos.spec.ts
│   ├── add-delete-todos.spec.ts
│   ├── clear-completed-todos.spec.ts
│   ├── double-click-edit-todos.spec.ts
│   └── validate-footer-links.spec.ts
├── playwright.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

> `playwright-report/` and `test-results/` are generated at runtime and excluded from git.

---

## 📖 Architecture Reference

For a detailed explanation of how the agents interact, the MCP bridge, and best practices, see [docs/agents-architecture.md](docs/agents-architecture.md).

Key concepts covered:
- Agent workflow diagram (Planner → Generator → Healer)
- MCP tools exposed to the LLM
- The role of `seed.spec.ts` as a bootstrap context
- Best practices: selector strategy, avoiding hard-coded timeouts, auditing agent output

---

## 📄 License

This project is available under the [MIT License](LICENSE).
