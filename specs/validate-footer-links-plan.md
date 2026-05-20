# Footer link click validation plan

## Application Overview

Validate footer attribution link text and click navigation for the TodoMVC app, including author and project attribution links.

## Test Scenarios

### 1. Footer Link Navigation

**Seed:** `tests/seed.spec.ts`

#### 1.1. Validate clicking the 'Created by' author link

**File:** `tests/validate-footer-links.spec.ts`

**Steps:**
  1. Open the TodoMVC application and ensure the footer attribution section is visible.
    - expect: The footer contains the label 'Created by'.
    - expect: The link text 'Remo H. Jansen' is present in the footer.
  2. Click the 'Remo H. Jansen' footer link.
    - expect: The browser navigates to the author URL containing 'github.com/remojansen'.
    - expect: The author page loads successfully after the click.

#### 1.2. Validate clicking the 'Part of' TodoMVC link

**File:** `tests/validate-footer-links.spec.ts`

**Steps:**
  1. Open the TodoMVC application and ensure the footer attribution section is visible.
    - expect: The footer contains the label 'Part of'.
    - expect: The link text 'TodoMVC' is present in the footer.
  2. Click the 'TodoMVC' footer link.
    - expect: The browser navigates to the project URL containing 'todomvc.com'.
    - expect: The TodoMVC landing page loads successfully after the click.
