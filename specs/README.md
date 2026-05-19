# Specs

This directory contains the test plan documents used to define end-to-end scenarios for the application.

Each file describes a specific feature or user flow and includes the steps and expected outcomes needed to generate or verify automated Playwright tests.

## Spec files

- `add-new-todos-plan.md` — scenarios for adding new todos
- `add-delete-todos-plan.md` — scenarios for adding and deleting todos
- `clear-completed-todos-plan.md` — scenarios for clearing completed todos
- `filter-todos-plan.md` — scenarios for filtering todo items

## Usage

- Use these markdown plans as the source of truth when writing or generating Playwright tests.
- Each plan should include:
  - a descriptive title
  - the starting state or seed file
  - detailed step-by-step actions
  - the expected results for each step

## Conventions

- Keep scenarios independent so they can run in any order.
- Use clear, tester-friendly language for action steps.
- Reference the shared seed file if the scenario depends on a common starting state.

## Adding a new plan

1. Create a new `*-plan.md` file in this folder.
2. Add a top-level title describing the feature or flow.
3. Define one or more scenarios with numbered steps and expected outcomes.
4. Keep the plan focused on testable behavior and edge cases.
