# 🎭 Playwright Test Agents POC

[![Playwright Version](https://img.shields.io/badge/Playwright-v1.60.0+-2e8b57.svg?style=flat-square&logo=playwright)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-ES2022-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg?style=flat-square&logo=opensource.org/licenses/MIT)]

A practical Proof of Concept demonstrating how Playwright Test Agents can be used to plan, generate, and maintain end-to-end tests for a TodoMVC-style application.

> This repository shows agent-driven test planning, Markdown-based scenario definitions, and Playwright tests that can be generated and healed automatically.

---

## 🚀 Project Overview

This project combines four key agent workflows:

- **Planner Agent**: explores the application and produces structured E2E test plans in `specs/`
- **Generator Agent**: converts Markdown plans into executable Playwright test scripts in `tests/`
- **Refactor Agent**: refactors existing Playwright `.spec.ts` files to use Page Object Model patterns in `pages/`
- **Healer Agent**: diagnoses failures, captures context, and updates tests when selectors or app behavior change

---

## 📁 Repository Structure

```bash
auto-poc/
├── .github/
│   └── agents/
│       ├── playwright-test-planner.agent.md
│       ├── playwright-test-generator.agent.md
│       ├── playwright-test-refactor.agent.md
│       └── playwright-test-healer.agent.md
├── .vscode/
│   └── mcp.json
├── docs/
│   └── agents-architecture.md
├── pages/
│   └── TodoPage.ts
├── specs/
│   ├── README.md
│   ├── add-delete-todos-plan.md
│   ├── add-new-todos-plan.md
│   ├── clear-completed-todos-plan.md
│   └── filter-todos-plan.md
├── playwright-report/        # generated report output (ignored by git)
├── tests/
│   ├── add-delete-todos.spec.ts
│   ├── add-new-todos.spec.ts
│   ├── clear-completed-todos.spec.ts
│   └── seed.spec.ts
├── test-results/             # generated test result artifacts (ignored by git)
├── playwright.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

---

## ⚡ Quick Start

1. Install dependencies:

```bash
npm install
```

2. Install Playwright browsers:

```bash
npx playwright install
```

3. Run the Playwright suite:

```bash
npx playwright test
```

4. View the test report:

```bash
npx playwright show-report
```

---

## 🧪 Current Test Plans & Specs

The repository contains the following plan-to-test mappings:

- `specs/add-new-todos-plan.md` → `tests/add-new-todos.spec.ts`
- `specs/add-delete-todos-plan.md` → `tests/add-delete-todos.spec.ts`
- `specs/clear-completed-todos-plan.md` → `tests/clear-completed-todos.spec.ts`

A `seed.spec.ts` file is included to establish the base application state used by the test suite.

---

## 📝 Specs Directory

The `specs/README.md` file now documents how to write, structure, and maintain Markdown test plans, including:

- clear scenario titles
- detailed step-by-step actions
- expected outcomes
- independent, runnable scenarios

---

## 🔧 Ignored Generated Artifacts

Generated outputs are ignored to keep the repo clean:

- `playwright-report/`
- `test-results/`

This avoids committing runtime artifacts from test execution.

---

## 📖 Further Reading

- `docs/agents-architecture.md` — architecture and agent workflow documentation

---

## 📄 License

This project is available under the [MIT License](LICENSE).
