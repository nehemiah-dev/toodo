# Specification Agent Instructions

## Purpose

This directory contains Toodo's product specification.

It defines:

* Product behavior
* User requirements
* UX requirements
* Data requirements
* Acceptance criteria

The specification is the source of truth for product behavior.

## Writing Rules

Describe **what the product does**, not how the code implements it.

Prefer:

> Users can search tasks by title, description, and category.

Avoid:

> `TaskList.tsx` calls `filterTasks()`.

Keep requirements concise, testable, and unambiguous.

Do not duplicate implementation instructions from the root `AGENTS.md` or `skills/AGENTS.md`.

## Product Scope

Toodo is:

* Frontend-only
* Local-first
* Built with React, Vite, and TypeScript
* Persisted with localStorage
* Designed around an emerald-green and white visual system

Core functionality:

* Create, edit, and delete tasks
* Complete and uncomplete tasks
* Search tasks
* Filter by All, Active, and Completed
* Categories and custom categories
* Due dates
* Low, Medium, and High priority
* Sorting
* Overdue indicators
* JSON import and export
* Responsive interface
* Accessibility
* Toast feedback
* Empty states
* Keyboard shortcuts

## Task Requirements

Each task contains:

```text
id
title
description
category
dueDate
priority
completed
createdAt
updatedAt
```

Required user-facing fields:

* Title
* Category
* Due date
* Priority

Description is optional.

Priority must be one of:

* Low
* Medium
* High

## Search and Filtering

Users can search tasks by:

* Title
* Description
* Category

Search is case-insensitive.

Users can filter tasks by:

* All
* Active
* Completed

Filtering and search may be used together.

## Sorting

Users can sort tasks by:

* Due date
* Priority
* Creation date
* Title

Sorting must not modify the underlying task data.

## Categories

Users can assign a category to each task.

Users can create custom categories.

The product may provide suggested categories such as:

* Work
* Personal
* Learning

Suggested categories must not prevent users from creating their own.

## Due Dates and Overdue Tasks

Each task must have a due date.

Active tasks whose due date has passed are considered overdue.

Completed tasks are not treated as overdue.

Overdue status must remain understandable without relying on color alone.

## Import and Export

JSON exports must include:

* Format version
* Export timestamp
* Tasks
* Categories

Example structure:

```json
{
  "version": 1,
  "exportedAt": "2026-10-01T08:30:00.000Z",
  "tasks": [],
  "categories": []
}
```

Imports must be validated before modifying existing data.

Users can choose to:

* Add imported tasks to existing tasks
* Replace existing tasks

Replacing existing data is destructive and requires confirmation.

Invalid or unsupported imports must not modify existing data.

## UX Requirements

The interface must support:

* Desktop
* Tablet
* Mobile
* Keyboard navigation
* Accessible controls
* Useful empty states
* Clear success and error feedback
* Confirmation for destructive actions

The interface should prioritize clarity, simple interactions, and minimal visual clutter.

Do not rely on color alone to communicate status, priority, or other important information.

## Accessibility Requirements

The product should provide:

* Semantic HTML
* Keyboard-accessible interactions
* Visible focus states
* Proper form labels
* Accessible dialogs
* Accessible buttons and controls
* Sufficient contrast

Interactive elements must be usable without a mouse.

## Keyboard Shortcuts

The product supports:

| Shortcut | Action                   |
| -------- | ------------------------ |
| `N`      | Create a new task        |
| `/`      | Focus search             |
| `Esc`    | Close the current dialog |

Shortcuts must not interfere with normal text input.

## Non-Goals

Do not add the following without an explicit product change:

* Backend
* Authentication
* User accounts
* Cloud synchronization
* Multi-user collaboration
* Server-side notifications
* Calendar integration
* AI features
* Payments or subscriptions
* Team/project management

## Acceptance Criteria

A feature is complete when:

* Its specified behavior works.
* Required data persists correctly.
* Invalid input is handled safely.
* Existing functionality remains intact.
* Responsive behavior is maintained.
* Accessibility requirements are maintained.
* Relevant tests and checks pass.

## Specification Changes

When requirements change:

1. Update the relevant specification.
2. Update acceptance criteria if necessary.
3. Check whether the data or import/export format has changed.
4. Update the implementation.
5. Verify existing behavior.
