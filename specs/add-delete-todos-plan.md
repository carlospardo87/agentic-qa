# Test Plan: Adding and Deleting Todos

## Overview
This test plan covers the lifecycle of adding todo items and subsequently deleting them from the list in the TodoMVC application. It verifies that items are correctly removed from the DOM and that the counter and footer visibility update appropriately.

## Starting State Assumptions
- The application is loaded at the base URL.
- **Seed Reference:** `tests/seed.spec.ts` handles the initial navigation and basic readiness checks.
- The todo list is initially empty.

---

## 1. Happy Path Scenarios

### Scenario 1.1: Add and delete a single todo
**Description:** Verify that a user can add a single item and then immediately delete it.
**Steps:**
1. Type "Task to delete" in the main input field and press `Enter`.
2. Verify the item "Task to delete" appears in the list.
3. Hover over the "Task to delete" list item to reveal the delete button (class `.destroy` or Accessible Name "Delete").
4. Click the delete button.
**Expected Outcomes (Success Criteria):**
- The item "Task to delete" is removed from the list.
- The list is empty.
- The footer containing the counter is no longer visible.

### Scenario 1.2: Delete a specific todo from a list of multiple items
**Description:** Verify that deleting a specific item from a list does not affect the other items and updates the counter correctly.
**Steps:**
1. Type "Task 1" in the main input field and press `Enter`.
2. Type "Task 2" in the main input field and press `Enter`.
3. Type "Task 3" in the main input field and press `Enter`.
4. Hover over "Task 2" in the list.
5. Click the delete button for "Task 2".
**Expected Outcomes (Success Criteria):**
- "Task 2" is removed from the list.
- "Task 1" and "Task 3" remain in the list.
- The item counter at the bottom updates to "2 items left".

---

## 2. Edge Cases

### Scenario 2.1: Delete all items one by one
**Description:** Verify that deleting all items sequentially properly resets the application state to empty.
**Steps:**
1. Type "First" and press `Enter`.
2. Type "Second" and press `Enter`.
3. Hover and click delete on "First".
4. Hover and click delete on "Second".
**Expected Outcomes (Success Criteria):**
- The list is completely empty.
- The item counter and the entire footer are no longer visible.

### Scenario 2.2: Rapidly adding and deleting items
**Description:** Ensure that rapid state changes (adding, then instantly deleting) do not cause visual glitches or counter sync issues.
**Steps:**
1. Type "Fast Task" and press `Enter`.
2. Immediately locate the new item and click its delete button.
**Expected Outcomes (Success Criteria):**
- The item is removed.
- The footer becomes hidden again.

---

## 3. Negative Testing Scenarios

### Scenario 3.1: Attempting to find delete button without hover (Accessibility/Structure)
**Description:** Verify that the delete button is structurally present inside the list item for automation/screen readers, even if it's visually hidden until hover.
**Steps:**
1. Type "Hidden Delete" and press `Enter`.
2. Without dispatching a hover event on the `li`, attempt to locate the delete button for "Hidden Delete" using the `getByRole('button', { name: 'Delete' })` locator.
**Expected Outcomes (Success Criteria):**
- The button exists in the DOM but is visually hidden (CSS `display: none` or `opacity: 0` until hovered, though Playwright can interact with it using force clicks, or we assert it is structurally present). *Note: The test script should hover first to simulate realistic user behavior.*
