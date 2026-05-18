# Test Plan: Adding New Todos

## Overview
This test plan covers the functionality of adding new todo items to the list in the TodoMVC application. It includes happy path scenarios, edge cases, and negative testing, adhering to the quality standards of the Playwright Test Planner Agent.

## Starting State Assumptions
- The application is loaded at the base URL.
- **Seed Reference:** `tests/seed.spec.ts` handles the initial navigation and basic readiness checks.
- The todo list is initially empty.
- The input field with placeholder "What needs to be done?" is visible.

---

## 1. Happy Path Scenarios

### Scenario 1.1: Add a single valid todo
**Description:** Verify that a user can successfully add a standard text todo item.
**Steps:**
1. Focus on the main input field ("What needs to be done?").
2. Type a standard string, e.g., "Buy groceries".
3. Press the `Enter` key.
**Expected Outcomes (Success Criteria):**
- The input field is cleared and ready for the next entry.
- A new item "Buy groceries" appears in the todo list.
- The item is unchecked by default.
- The footer becomes visible and the item counter updates to "1 item left".
**Failure Conditions:**
- The item does not appear in the list.
- The item appears checked.
- The input field retains the typed text.

### Scenario 1.2: Add multiple valid todos
**Description:** Verify that adding multiple items sequentially works correctly and updates the count.
**Steps:**
1. Type "Task 1" in the main input field and press `Enter`.
2. Type "Task 2" in the main input field and press `Enter`.
3. Type "Task 3" in the main input field and press `Enter`.
**Expected Outcomes (Success Criteria):**
- The list displays all three items in the order they were added (Task 1 at the top, or bottom depending on implementation, but consistently ordered).
- The item counter in the footer updates to "3 items left".

---

## 2. Edge Cases

### Scenario 2.1: Add a todo with leading/trailing whitespace
**Description:** Verify that the application trims whitespace from the input before saving.
**Steps:**
1. Focus on the main input field.
2. Type "   Spaced out task   ".
3. Press the `Enter` key.
**Expected Outcomes (Success Criteria):**
- The list displays a new item with the text "Spaced out task" (whitespace trimmed).

### Scenario 2.2: Add a todo with special characters and emojis
**Description:** Verify that the application handles special characters properly.
**Steps:**
1. Focus on the main input field.
2. Type "Buy 🍎 & 🍌 (100% organic!) @market".
3. Press the `Enter` key.
**Expected Outcomes (Success Criteria):**
- The item appears exactly as typed with all special characters and emojis preserved.

### Scenario 2.3: Add an extremely long todo
**Description:** Verify that long text does not break the layout or fail to save.
**Steps:**
1. Type a continuous string of 200 characters in the main input field.
2. Press the `Enter` key.
**Expected Outcomes (Success Criteria):**
- The item is successfully added to the list.
- The text is properly wrapped or truncated via CSS within the layout constraints of the list item, avoiding horizontal overflow.

---

## 3. Negative Testing Scenarios

### Scenario 3.1: Attempt to add an empty todo
**Description:** Verify that the application does not allow adding an empty item.
**Steps:**
1. Focus on the main input field.
2. Ensure the field is completely empty.
3. Press the `Enter` key.
**Expected Outcomes (Success Criteria):**
- No new item is added to the list.
- The item counter remains unchanged (or the footer remains hidden if the list was 0).

### Scenario 3.2: Attempt to add a whitespace-only todo
**Description:** Verify that an item consisting only of spaces is treated as empty and not added.
**Steps:**
1. Focus on the main input field.
2. Type "     " (5 spaces).
3. Press the `Enter` key.
**Expected Outcomes (Success Criteria):**
- No new item is added to the list.
- The input field is cleared.
