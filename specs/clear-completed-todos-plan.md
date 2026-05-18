# Test Plan: Clear Completed Todos

## Overview
This test plan covers the functionality of the "Clear completed" button in the TodoMVC application. It verifies that the button only appears when completed tasks exist, and that clicking it correctly removes only the completed tasks from the DOM while updating the application's overall state.

## Starting State Assumptions
- The application is loaded at the base URL.
- **Seed Reference:** `tests/seed.spec.ts` handles the initial navigation and basic readiness checks.
- The todo list is initially empty.

---

## 1. Happy Path Scenarios

### Scenario 1.1: Clear a single completed todo
**Description:** Verify that a user can mark a single item as completed and clear it.
**Steps:**
1. Add a new todo item: "Buy milk".
2. Click the checkbox next to "Buy milk" to mark it as completed.
3. Verify that the "Clear completed" button becomes visible in the footer.
4. Click the "Clear completed" button.
**Expected Outcomes (Success Criteria):**
- The "Buy milk" item is removed from the list.
- The entire list is now empty.
- The footer and the "Clear completed" button are no longer visible.

### Scenario 1.2: Clear multiple completed todos while leaving active ones
**Description:** Verify that clearing completed tasks does not affect active (uncompleted) tasks.
**Steps:**
1. Add three new todo items: "Task A", "Task B", "Task C".
2. Click the checkbox next to "Task A" and "Task C" to mark them as completed.
3. Verify the item counter reads "1 item left".
4. Click the "Clear completed" button.
**Expected Outcomes (Success Criteria):**
- "Task A" and "Task C" are removed from the list.
- "Task B" remains in the list.
- The "Clear completed" button disappears because there are no longer any completed tasks.
- The item counter still reads "1 item left".

---

## 2. Edge Cases

### Scenario 2.1: Complete all tasks and clear them
**Description:** Verify the behavior when every item in the list is completed and then cleared simultaneously.
**Steps:**
1. Add "Task X" and "Task Y".
2. Click the "Mark all as complete" toggle at the top of the list (the chevron above the checkboxes) OR check them individually.
3. Click the "Clear completed" button.
**Expected Outcomes (Success Criteria):**
- Both "Task X" and "Task Y" are removed.
- The list is completely empty.
- The footer disappears.

---

## 3. Negative Testing Scenarios

### Scenario 3.1: "Clear completed" button is hidden when no tasks are completed
**Description:** Verify that the "Clear completed" button is not accessible or visible if no tasks are checked.
**Steps:**
1. Add a new todo item: "Active Task".
2. Do NOT check the checkbox.
**Expected Outcomes (Success Criteria):**
- The footer is visible.
- The item counter displays "1 item left".
- The "Clear completed" button (class `.clear-completed` or Accessible Name "Clear completed") is NOT visible in the DOM.
