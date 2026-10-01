## Toodo Product Design Specification

### 1. Product Overview

Toodo is a clean, local-first todo application for managing everyday tasks. It is designed to make creating, organizing, and completing tasks quick and simple without requiring an account or internet connection. Toodo is frontend-only and stores task data locally in the browser.

### 2. Product Goals

Toodo should:

* Make adding and managing tasks quick.
* Make important task information easy to scan.
* Provide simple organization through categories, priorities, and due dates.
* Help users find tasks quickly through search, filtering, and sorting.
* Clearly identify overdue tasks.
* Preserve tasks between browser sessions.
* Allow users to back up and restore their data.
* Work well on desktop, tablet, and mobile devices.
* Remain simple rather than becoming a full project-management application.

### 3. Visual Design

Toodo uses a minimal productivity-focused visual system.

#### Colors

* **Emerald green** — primary accent and action color.
* **White** — primary surface color.
* **Light neutral colors** — page backgrounds and secondary surfaces.
* **Dark text** — primary content.
* **Subtle neutral borders and shadows** — separation and depth.

Emerald should be used as an accent rather than covering large portions of the interface.

**Important states must not be communicated through color alone.**

#### Layout

The interface should use generous whitespace and clear visual hierarchy.

**Desktop Layout Overview:**

```text
┌──────────────────────────────────────────────────────────┐
│ Toodo                              Import   Export       │
├───────────────┬──────────────────────────────────────────┤
│               │                                          │
│ All           │ Tasks                                    │
│ Active        │                                          │
│ Completed     │ Search                         Add Task  │
│               │                                          │
│ Categories    │ ┌──────────────────────────────────────┐ │
│ Work          │ │ Task                                  │ │
│ Personal      │ │ Description · Category · Due date     │ │
│ Learning      │ │ Priority                 Actions      │ │
│               │ └──────────────────────────────────────┘ │
│               │                                          │
└───────────────┴──────────────────────────────────────────┘

```

The exact layout may adapt for smaller screens.

### 4. Application Navigation

The application provides access to:

* All tasks
* Active tasks
* Completed tasks
* Categories

The selected view should be visually identifiable and accessible without relying only on color.

On mobile, navigation may use a compact layout appropriate for the available screen width.

### 5. Task Creation

Users can create a task using the **Add Task** action.

The task form contains:

* Title
* Description
* Category
* Due date
* Priority

**Required fields:**

* Title
* Category
* Due date
* Priority

Description is optional.

The form should clearly indicate required fields and validation errors.

After successful creation, the new task appears in the task list and is persisted locally.

### 6. Task Editing

Users can edit an existing task.

The same form should be used for creation and editing where practical.

Editing allows users to change:

* Title
* Description
* Category
* Due date
* Priority

Updating a task updates its `updatedAt` value.

### 7. Completing Tasks

Each task has a control for marking it complete.

Users can:

* Complete an active task.
* Uncomplete a completed task.

Completed tasks remain stored and can be viewed through the Completed filter.

Completing a task should provide clear visual feedback without relying solely on color.

### 8. Deleting Tasks

Users can permanently delete a task.

Deletion is a destructive action and requires confirmation.

After confirmation, the task is removed from the task collection and local storage.

### 9. Task Cards

Each task card should make important information easy to scan.

A task card should display, where applicable:

* Completion control
* Title
* Description
* Category
* Due date
* Priority
* Actions

The task title should have the strongest visual emphasis.

Completed tasks should have a clear completed state.

Overdue tasks should be visually identifiable and should include a non-color indicator such as text or an icon.

### 10. Categories

Every task has a category.

Toodo provides suggested categories such as:

* Work
* Personal
* Learning

Users can create custom categories.

Categories can be used when:

* Creating tasks
* Editing tasks
* Searching
* Filtering or navigating tasks

### 11. Due Dates

Every task has a due date.

Toodo identifies active tasks whose due date has passed as **overdue**.

Completed tasks are not treated as overdue.

The due date should be displayed in a human-readable format.

### 12. Priorities

Every task has one priority:

* Low
* Medium
* High

Priority should be easy to identify but should not rely solely on color.

### 13. Search

Users can search tasks from the main task view.

Search is:

* Case-insensitive.
* Applied to title, description, and category.
* Updated as the search query changes.

Search works together with the selected task filter.

*Example: searching while viewing Active tasks only searches active tasks.*

### 14. Filters

Users can filter tasks by:

* **All**
* Displays all tasks.


* **Active**
* Displays tasks that are not completed.


* **Completed**
* Displays completed tasks.



Search and sorting continue to apply within the selected filter.

### 15. Sorting

Users can sort tasks by:

* Due date
* Priority
* Creation date
* Title

Sorting changes the displayed order only. It does not modify the underlying task data.

The default view should prioritize actionable tasks:

1. Overdue active tasks
2. Tasks due today
3. Upcoming active tasks
4. Active tasks without a due date
5. Completed tasks

Priority may be used as a secondary ordering where appropriate.

### 16. Empty States

The application should provide useful empty states rather than displaying a blank interface.

Examples include:

* No tasks exist yet.
* No active tasks exist.
* No completed tasks exist.
* No tasks match the current search.
* No tasks match the current filter.

Empty states should explain the current situation and provide an appropriate next action when possible.

### 17. Toast Feedback

Toodo uses toast notifications for short-lived success and error feedback.

Examples:

* Task created.
* Task updated.
* Task deleted.
* Task completed.
* Data exported.
* Data imported successfully.
* Import failed.

Toasts should not contain information that users need to remember or act on after they disappear.

### 18. Import and Export

Toodo supports JSON data export for backup and portability.

**An export contains:**

```json
{
  "version": 1,
  "exportedAt": "2026-10-01T08:30:00.000Z",
  "tasks": [],
  "categories": []
}

```

#### Export

Users can export their current tasks and categories as a JSON file.

#### Import

Users can select a JSON export file.

Before changing application data, Toodo must:

1. Parse the file.
2. Validate its structure.
3. Validate task and category data.
4. Show an import preview.
5. Allow the user to choose how the data should be applied.

Users can choose:

* **Add** — add the imported tasks to existing tasks.
* **Replace** — replace existing tasks with the imported data.

Replacing existing data requires confirmation.

Invalid or unsupported files must not modify existing data.

### 19. Import Preview

The import preview should allow users to understand what will be imported before applying it.

The preview should provide enough information to distinguish the import from the current data and clearly indicate whether the user is adding or replacing data.

### 20. Persistence

Task and category data is persisted using browser `localStorage`.

Data should remain available after:

* Page refresh.
* Closing and reopening the application in the same browser.

Toodo does not synchronize data between browsers or devices.

**Clearing the browser's site data may permanently remove stored tasks.**

Users should use **Export** to create a portable backup.

### 21. Keyboard Shortcuts

Toodo supports:

| Shortcut | Action |
| --- | --- |
| `N` | Create a new task |
| `/` | Focus search |
| `Esc` | Close the current dialog |

Shortcuts must not interfere with normal typing in text fields or text areas.

### 22. Responsive Design

Toodo must work across:

* Desktop
* Tablet
* Mobile

The interface should adapt its navigation, task layout, controls, and spacing to the available screen size.

On smaller screens:

* Navigation should remain accessible without consuming excessive space.
* Task cards should remain readable.
* Primary actions should remain easy to reach.
* Dialogs and forms should fit within the viewport.

### 23. Accessibility

Toodo should support keyboard and assistive-technology users.

The interface must provide:

* Semantic HTML.
* Keyboard navigation.
* Visible focus states.
* Proper form labels.
* Accessible buttons and icon buttons.
* Accessible dialogs.
* Logical focus behavior.
* Sufficient contrast.
* Status information that does not rely solely on color.

Interactive controls should have clear accessible names.

Dialogs should support closing with Escape where appropriate.

### 24. Task Data

A task contains:

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  category: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

```

Categories are stored separately as part of the application's local data.

Derived values such as search results, filtered tasks, sorted tasks, and task counts are not stored as independent task collections.

### 25. Non-Goals

Toodo does **not** include:

* User authentication
* User accounts
* Backend APIs
* Cloud synchronization
* Multi-user collaboration
* Server-side notifications
* Calendar synchronization
* Team or project management
* AI task generation
* Payments or subscriptions

These features require an explicit product decision before being introduced.

### 26. Acceptance Criteria

A feature is complete when:

* The specified user behavior works.
* Required data persists correctly.
* Invalid input is handled safely.
* Existing functionality remains intact.
* The interface works across supported screen sizes.
* Keyboard and accessibility requirements remain satisfied.
* Destructive actions require confirmation.
* Relevant verification checks pass.