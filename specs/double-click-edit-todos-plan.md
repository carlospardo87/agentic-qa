# Test Plan: Double-click Edit Todos

## Overview
This test plan covers the TodoMVC double-click edit workflow for todo items, including happy path editing, cancel behavior, deletion through empty edit, and preservation of state for completed items.

## Starting State Assumptions
- The application is loaded at the base URL.
- `tests/seed.spec.ts` handles initial navigation and basic readiness checks.
- The todo list is initially empty.
- The input field with placeholder "What needs to be done?" is visible.

---

## Scenario 1.1: Edit a todo item and save with Enter
**Description:** Verify that a user can double-click a todo label, edit the text, and save the change by pressing Enter.

**Steps:**
1. Add a new todo item with text "Read a book".
2. Double-click the todo item's label to enter edit mode.
3. Change the text to "Read two books".
4. Press the Enter key.

**Expected Outcomes:**
- The todo item text updates to "Read two books".
- The item remains visible in the list.
- The todo count remains "1 item left".
- No duplicate items are created.

---

## Scenario 1.2: Edit a completed todo preserves completed state
**Description:** Verify that editing a completed todo item maintains its completed state after saving.

**Steps:**
1. Add a new todo item with text "Submit report".
2. Mark the todo item as completed.
3. Double-click the completed todo label to start editing.
4. Change the text to "Submit final report".
5. Press the Enter key.

**Expected Outcomes:**
- The todo text updates to "Submit final report".
- The item remains completed.
- The footer continues to show "0 items left".

---

## Scenario 2.1: Cancel edit with Escape keeps original text
**Description:** Verify that pressing Escape during edit mode cancels the change and retains the original todo text.

**Steps:**
1. Add a new todo item with text "Pay bills".
2. Double-click the todo label to enter edit mode.
3. Change the text to "Pay utility bills".
4. Press the Escape key.

**Expected Outcomes:**
- The inline edit input disappears.
- The original text "Pay bills" remains unchanged.
- No new todo item is created.

---

## Scenario 2.2: Clear text while editing removes the todo
**Description:** Verify that saving an empty edit input deletes the todo item.

**Steps:**
1. Add a new todo item with text "Call mom".
2. Double-click the todo label to start editing.
3. Delete the existing text so the input becomes empty.
4. Press the Enter key.

**Expected Outcomes:**
- The todo item is removed from the list.
- The footer count updates accordingly.

---

## Scenario 2.3: Edit one todo without affecting others
**Description:** Verify that editing one todo item does not alter the text or state of other todos.

**Steps:**
1. Add three todo items: "Task A", "Task B", and "Task C".
2. Double-click only the label for "Task B".
3. Change the text to "Task B updated".
4. Press the Enter key.

**Expected Outcomes:**
- Only the "Task B" item updates to "Task B updated".
- "Task A" and "Task C" remain unchanged.
- The total item count remains "3 items left".
