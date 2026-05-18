# Test Plan: Filtering Todos (All, Active, Completed)

## Overview
This test plan covers the functionality of the routing filters ("All", "Active", "Completed") located in the footer of the TodoMVC application. It verifies that tasks are correctly filtered based on their completion status, that the UI reflects the active filter visually, and that URL routing state behaves correctly.

## Starting State Assumptions
- The application is loaded at the base URL.
- **Seed Reference:** `tests/seed.spec.ts` handles the initial navigation and basic readiness checks.
- The todo list is initially empty.

---

## 1. Happy Path Scenarios

### Scenario 1.1: Filter by "Active"
**Description:** Verify that selecting the "Active" filter hides completed tasks and shows only uncompleted ones.
**Steps:**
1. Add three new todo items: "Task A", "Task B", "Task C".
2. Mark "Task B" as completed.
3. Click the "Active" filter link in the footer.
**Expected Outcomes (Success Criteria):**
- The URL hash changes to `#/active`.
- Only "Task A" and "Task C" are visible in the list.
- "Task B" is completely hidden.
- The "Active" filter button has the `selected` class applied visually indicating the active state.

### Scenario 1.2: Filter by "Completed"
**Description:** Verify that selecting the "Completed" filter hides active tasks and shows only completed ones.
**Steps:**
1. (Continuing from the state of 1.1) Click the "Completed" filter link in the footer.
**Expected Outcomes (Success Criteria):**
- The URL hash changes to `#/completed`.
- Only "Task B" is visible in the list.
- "Task A" and "Task C" are completely hidden.
- The "Completed" filter button has the `selected` class applied visually.

### Scenario 1.3: Filter by "All"
**Description:** Verify that selecting the "All" filter resets the view to show every task regardless of status.
**Steps:**
1. (Continuing from the state of 1.2) Click the "All" filter link in the footer.
**Expected Outcomes (Success Criteria):**
- The URL hash changes to `#/` or `#/all`.
- "Task A", "Task B", and "Task C" are all visible in the list.
- The "All" filter button has the `selected` class applied visually.

---

## 2. Edge Cases

### Scenario 2.1: State preservation when completing tasks while filtered
**Description:** Ensure that marking an active task as completed while in the "Active" view immediately hides it from the current view.
**Steps:**
1. Ensure the view is set to the "Active" filter (`#/active`).
2. The list currently shows "Task A" and "Task C" as active.
3. Mark "Task A" as completed.
**Expected Outcomes (Success Criteria):**
- "Task A" immediately disappears from the list view (as it no longer matches the "Active" filter).
- Only "Task C" remains visible.
- The item counter updates accurately to "1 item left".

### Scenario 2.2: Direct URL Routing
**Description:** Verify that navigating directly to a deep-link URL (e.g., refreshing on `#/completed`) correctly applies the filter on load.
**Steps:**
1. Create a state with 1 active and 1 completed task.
2. Directly navigate to the base URL + `#/completed` using `page.goto()`.
**Expected Outcomes (Success Criteria):**
- The application loads and immediately filters the view.
- Only the completed task is visible.
- The "Completed" filter is visually highlighted.

---

## 3. Negative Testing Scenarios

### Scenario 3.1: Filters are hidden when no tasks exist
**Description:** Verify that the filter navigation list is not rendered if the todo list is completely empty.
**Steps:**
1. Load a fresh application instance with 0 tasks.
**Expected Outcomes (Success Criteria):**
- The filter container (the `ul.filters`) is not visible in the DOM.
