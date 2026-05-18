# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: add-new-todos.spec.ts >> 3. Negative Testing Scenarios >> Scenario 3.2: Attempt to add a whitespace-only todo
- Location: tests/add-new-todos.spec.ts:143:7

# Error details

```
Error: expect(locator).toBeEmpty() failed

Locator:  getByPlaceholder('What needs to be done?')
Expected: empty
Received: notEmpty
Timeout:  5000ms

Call log:
  - Expect "toBeEmpty" with timeout 5000ms
  - waiting for getByPlaceholder('What needs to be done?')
    14 × locator resolved to <input class="new-todo" placeholder="What needs to be done?"/>
       - unexpected value "notEmpty"

```

```yaml
- textbox "What needs to be done?"
```

# Test source

```ts
  63  |     await expect(page.getByTestId('todo-count')).toHaveText('3 items left');
  64  |   });
  65  | });
  66  | 
  67  | test.describe('2. Edge Cases', () => {
  68  |   test('Scenario 2.1: Add a todo with leading/trailing whitespace', async ({ page }) => {
  69  |     // 1. Focus on the main input field.
  70  |     const todoInput = page.getByPlaceholder('What needs to be done?');
  71  |     await todoInput.click();
  72  | 
  73  |     // 2. Type "   Spaced out task   ".
  74  |     await todoInput.fill('   Spaced out task   ');
  75  | 
  76  |     // 3. Press the Enter key.
  77  |     await todoInput.press('Enter');
  78  | 
  79  |     // Expected Outcomes:
  80  |     // - The list displays a new item with the text "Spaced out task" (whitespace trimmed).
  81  |     const todoItem = page.getByTestId('todo-item').first();
  82  |     await expect(todoItem.getByTestId('todo-title')).toHaveText('Spaced out task');
  83  |   });
  84  | 
  85  |   test('Scenario 2.2: Add a todo with special characters and emojis', async ({ page }) => {
  86  |     // 1. Focus on the main input field.
  87  |     const todoInput = page.getByPlaceholder('What needs to be done?');
  88  |     await todoInput.click();
  89  | 
  90  |     // 2. Type "Buy 🍎 & 🍌 (100% organic!) @market".
  91  |     const complexText = 'Buy 🍎 & 🍌 (100% organic!) @market';
  92  |     await todoInput.fill(complexText);
  93  | 
  94  |     // 3. Press the Enter key.
  95  |     await todoInput.press('Enter');
  96  | 
  97  |     // Expected Outcomes:
  98  |     // - The item appears exactly as typed with all special characters and emojis preserved.
  99  |     const todoItem = page.getByTestId('todo-item').first();
  100 |     await expect(todoItem.getByTestId('todo-title')).toHaveText(complexText);
  101 |   });
  102 | 
  103 |   test('Scenario 2.3: Add an extremely long todo', async ({ page }) => {
  104 |     // 1. Type a continuous string of 200 characters in the main input field.
  105 |     const todoInput = page.getByPlaceholder('What needs to be done?');
  106 |     const longString = 'A'.repeat(200);
  107 |     await todoInput.fill(longString);
  108 | 
  109 |     // 2. Press the Enter key.
  110 |     await todoInput.press('Enter');
  111 | 
  112 |     // Expected Outcomes:
  113 |     // - The item is successfully added to the list.
  114 |     const todoItem = page.getByTestId('todo-item').first();
  115 |     await expect(todoItem.getByTestId('todo-title')).toHaveText(longString);
  116 | 
  117 |     // - The text is properly wrapped or truncated via CSS within the layout constraints
  118 |     // (Playwright verifies it is rendered and visible without throwing layout errors)
  119 |     await expect(todoItem).toBeVisible();
  120 |   });
  121 | });
  122 | 
  123 | test.describe('3. Negative Testing Scenarios', () => {
  124 |   test('Scenario 3.1: Attempt to add an empty todo', async ({ page }) => {
  125 |     // 1. Focus on the main input field.
  126 |     const todoInput = page.getByPlaceholder('What needs to be done?');
  127 |     await todoInput.click();
  128 | 
  129 |     // 2. Ensure the field is completely empty.
  130 |     await todoInput.fill('');
  131 | 
  132 |     // 3. Press the Enter key.
  133 |     await todoInput.press('Enter');
  134 | 
  135 |     // Expected Outcomes:
  136 |     // - No new item is added to the list.
  137 |     await expect(page.getByTestId('todo-item')).toHaveCount(0);
  138 | 
  139 |     // - The item counter remains unchanged (or the footer remains hidden if the list was 0).
  140 |     await expect(page.locator('.footer')).not.toBeVisible();
  141 |   });
  142 | 
  143 |   test('Scenario 3.2: Attempt to add a whitespace-only todo', async ({ page }) => {
  144 |     // test.fixme() added by the Healer agent because the application leaves the whitespace 
  145 |     // in the input field instead of clearing it as expected.
  146 |     // test.fixme();
  147 | 
  148 |     // 1. Focus on the main input field.
  149 |     const todoInput = page.getByPlaceholder('What needs to be done?');
  150 |     await todoInput.click();
  151 | 
  152 |     // 2. Type "     " (5 spaces).
  153 |     await todoInput.fill('     ');
  154 | 
  155 |     // 3. Press the Enter key.
  156 |     await todoInput.press('Enter');
  157 | 
  158 |     // Expected Outcomes:
  159 |     // - No new item is added to the list.
  160 |     await expect(page.getByTestId('todo-item')).toHaveCount(0);
  161 | 
  162 |     // - The input field is cleared.
> 163 |     await expect(todoInput).toBeEmpty();
      |                             ^ Error: expect(locator).toBeEmpty() failed
  164 |   });
  165 | });
  166 | 
```