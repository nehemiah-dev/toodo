# Agent Skills

## Scope

These instructions apply to the `skills/` directory.

Read the root `../AGENTS.md` before using these instructions.

The `skills/` directory contains instructions and workflows for agents working on Toodo. It does not contain application source code.

## Implementation Workflow

Before making changes:

1. Read the relevant project instructions.
2. Inspect the existing implementation.
3. Identify the smallest change that satisfies the request.
4. Reuse existing components, hooks, utilities, and patterns where appropriate.
5. Verify the result using the project's configured commands.

Do not create new abstractions or files unless they solve a real problem.

## Application Architecture

Toodo is a frontend-only React application.

The preferred flow is:

```text
Components
    ↓
Hooks / State
    ↓
Utilities
    ↓
localStorage
```

Keep persistence and data handling separate from presentation components.

The application source lives at the repository root under `src/`:

```text
src/
├── components/
├── hooks/
├── lib/
├── types/
├── styles/
├── App.tsx
└── main.tsx
```

Adapt this structure to the existing codebase rather than forcing it.

## State Management

Maintain a single source of truth for tasks.

Do not persist derived state such as:

* Active tasks
* Completed tasks
* Search results
* Filtered tasks
* Sorted tasks

Derive these from the task collection.

Avoid global state libraries unless the existing application genuinely requires one.

## Task Operations

Task-related implementation should support:

* Create
* Edit
* Complete/uncomplete
* Delete
* Search
* Filter
* Sort
* Categories
* Due dates
* Priorities
* Import/export

Search should be case-insensitive and cover:

* Title
* Description
* Category

Required filters:

* All
* Active
* Completed

## Forms

The task form should support:

* Title
* Description
* Category
* Due date
* Priority

Validate input before mutating task state.

Reuse the same form for creation and editing where practical.

## Storage

Keep localStorage access centralized.

Handle:

* Missing data
* Invalid JSON
* Invalid stored structures
* Older data versions

Malformed localStorage data must not crash the application.

## Import and Export

Validate imported JSON before modifying application state.

Support:

* Adding imported tasks to existing tasks
* Replacing existing tasks

Require confirmation before replacing existing data.

Treat imported data as untrusted input.

## UI Implementation

Follow the Toodo design system:

* Emerald green
* White
* Light neutral backgrounds
* Dark text
* Subtle borders and shadows
* Responsive layouts

Prioritize clarity and usability over decoration.

Use semantic HTML and accessible controls.

## Accessibility

Implementation should provide:

* Keyboard navigation
* Visible focus states
* Proper labels
* Accessible icon buttons
* Accessible dialogs
* Escape-to-close dialogs
* Sufficient color contrast
* Status information that does not rely on color alone

Use buttons and links for interactive elements rather than clickable `<div>` elements.

## Performance

Do not optimize prematurely.

Avoid unnecessary:

* Memoization
* Effects
* Dependencies
* Abstractions
* Global state

Optimize when there is a demonstrated performance problem or a clear requirement.

## Verification

Use the commands configured by the project.

After substantial changes, run the relevant:

* Production build
* Tests
* Linting

Do not claim a check was performed unless it was actually run.
