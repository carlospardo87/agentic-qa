# 🎭 Playwright Test Agents POC

[![Playwright Version](https://img.shields.io/badge/Playwright-v1.60.0+-2e8b57.svg?style=flat-square&logo=playwright)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-ES2022-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg?style=flat-square)](https://opensource.org/licenses/MIT)

A stunning Proof of Concept (POC) showcasing the state-of-the-art **Playwright Test Agents** (Planner, Generator, Healer). This E2E testing framework is designed using AI agents that collaborate to explore, generate, and maintain your test suites against the standardized **TodoMVC** application.

> [!NOTE]
> This framework demonstrates how natural language instructions can be converted into robust, executable Playwright E2E tests, and kept updated automatically when selectors change.

---

## 🚀 Architectural Overview

Playwright Test Agents leverage the **Model Context Protocol (MCP)** to interact directly with local browser sessions, snapshots, and directories. The suite is split into three main characters:

1. **🎭 Planner Agent**: Explores your web app and produces an E2E test plan (`specs/todo-operations.md`).
2. **🎭 Generator Agent**: Translates the human-readable Markdown test plan into clean, standard E2E test scripts (`tests/todo-operations.spec.ts`).
3. **🎭 Healer Agent**: Listens for test failures, captures DOM snapshots, repairs broken/flaky selectors, and automatically updates the code.

---

## 📁 Repository Structure

The project has been organized according to Playwright's E2E and Agentic structure:

```bash
auto-poc/
├── .github/
│   └── agents/                     # 🤖 Playwright Test Agent system prompts
│       ├── playwright-test-planner.agent.md
│       ├── playwright-test-generator.agent.md
│       └── playwright-test-healer.agent.md
├── .vscode/
│   └── mcp.json                    # 🔧 VS Code MCP Configuration
├── specs/
│   ├── README.md
│   └── todo-operations.md          # 📝 Human-readable Markdown E2E test plans
├── tests/
│   ├── seed.spec.ts                # 🌱 Bootstrap seed test (context provider)
│   └── todo-operations.spec.ts     # 💻 Executable TypeScript E2E tests
├── docs/
│   └── agents-architecture.md      # 📔 Deep-dive E2E Agent architecture guide
├── playwright.config.ts            # ⚙️ Playwright E2E Runner configuration
├── tsconfig.json                   # ⚙️ TypeScript configuration
└── package.json                    # 📦 Core package dependencies
```

---

## ⚡ Quick Start Guide

Follow these simple steps to set up, explore, and run the POC on your local machine:

### 1. Prerequisite Installations
Ensure you have Node.js (v18+) and npm installed. Clone the repository, navigate into the directory, and install dependencies:

```bash
# Install core test libraries and Playwright
npm install

# Download and install required Playwright E2E browsers
npx playwright install
```

### 2. Initialize Playwright E2E Agents
The agent templates are initialized by executing:

```bash
# This creates the .github/agents files and VS Code MCP settings
npx playwright init-agents --loop=vscode
```

### 3. Execution of the E2E Test Suite
Run the test runner to execute the E2E test suite in parallel across Chromium, Firefox, and WebKit:

```bash
# Run tests in headless mode (default)
npx playwright test

# Run tests in interactive UI Mode
npx playwright test --ui

# Open the E2E results HTML report
npx playwright show-report
```

---

## 📝 Test Plan & E2E Scenarios (TodoMVC)

The demo targets `https://demo.playwright.dev/todomvc/#/` and exercises the core functionality of the application:

1. **Adding Todos**: 
   - Add a single task (e.g. "Buy fresh organic milk") & assert footer visibility, task unchecked state, and active todo counter.
   - Add multiple tasks & assert chronological listing order and item counters.
2. **Toggling & Completing**:
   - Toggle individual todos & assert strike-through visual styling and "Clear Completed" button appearance.
   - Toggle all items simultaneously using the header chevron and restore back to active state.
3. **Editing Items**:
   - Double-click item text to edit, type new label, save with `Enter`, and verify update.
   - Double-click item, modify text, hit `Escape` to cancel, and verify original state is restored.
4. **Filtering Views**:
   - Click "Active" to view only unfinished tasks.
   - Click "Completed" to view only finished tasks.
   - Click "All" to restore complete list view & verify browser URL hashes.
5. **Deleting & Clearing**:
   - Hover and click "Delete" button (destroy) to remove individual item.
   - Complete specific tasks and click "Clear completed" to prune finished items.

---

## 🔬 Under the Hood: MCP Setup

The agents use an MCP connection defined in `.vscode/mcp.json`. Your IDE coding agent (like VS Code Copilot, Claude Code, etc.) uses this server to interact with the Playwright Runner.

```json
{
  "mcpServers": {
    "playwright-test": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "playwright",
        "run-test-mcp-server"
      ],
      "tools": [
        "*"
      ]
    }
  }
}
```

This protocol allows the agent to:
- Navigate to pages and explore DOM states.
- Click, type, hover, scroll, and drag elements on the screen.
- Auto-generate robust selector codes in line with E2E accessibility best practices.

---

## 📖 Deep-Dive Resources

For a complete breakdown of the agents' mechanics, MCP workflows, and healing behaviors, view our comprehensive architectural documentation:
- 📑 [Agents Architecture & Mechanics Guide](file:///Users/carlos.pardo/Desktop/Auto-POC/docs/agents-architecture.md)

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
