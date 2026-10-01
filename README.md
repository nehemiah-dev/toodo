# Toodo

Toodo helps you manage everyday tasks with categories, priorities, due dates, search, filtering, and JSON import/export — without requiring an account or backend.

## Features

* Create, edit, complete, and delete tasks
* Task descriptions
* Categories and custom categories
* Due dates
* Priority levels: Low, Medium, High
* Search tasks by title, description, or category
* Filter by:

  * All
  * Active
  * Completed
* Sort tasks by due date, priority, creation date, or title
* Automatic overdue detection
* JSON import and export
* Import preview with add/replace options
* Persistent local storage
* Toast notifications
* Keyboard shortcuts
* Responsive desktop, tablet, and mobile interface
* Accessible keyboard-friendly interactions

## Tech Stack

* **React**
* **TypeScript**
* **Vite**
* **CSS**
* **localStorage**

Toodo is intentionally frontend-only. There is no backend, authentication, database, or cloud synchronization.

## How It Works

Toodo uses the browser's `localStorage` as its persistence layer.

```text
User
 │
 ▼
React UI
 │
 ▼
Task State
 │
 ├── Search
 ├── Filter
 ├── Sort
 └── Task Mutations
 │
 ▼
Storage Layer
 │
 ▼
localStorage
```

Tasks remain available after refreshing or reopening the application in the same browser.

## Task Model

A task contains:

```ts
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

## Import & Export

Toodo supports portable JSON backups.

Exports contain a versioned structure:

```json
{
  "version": 1,
  "exportedAt": "2026-10-01T08:30:00.000Z",
  "tasks": [],
  "categories": []
}
```

When importing, Toodo validates the file before modifying existing data.

Users can choose to:

* Add imported tasks to existing tasks.
* Replace existing tasks.

Replacing existing data requires confirmation.

## Keyboard Shortcuts

| Shortcut | Action                   |
| -------- | ------------------------ |
| `N`      | Create a new task        |
| `/`      | Focus search             |
| `Esc`    | Close the current dialog |

Shortcuts do not interfere with normal text input.

## Project Structure

```text
toodo/
├── AGENTS.md
├── README.md
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
├── index.html
├── public/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   ├── styles/
│   ├── App.tsx
│   └── main.tsx
├── spec/
│   ├── AGENTS.md
│   └── ...
└── skills/
    └── AGENTS.md
```

The repository contains agent instructions at different levels:

* `AGENTS.md` — project-wide engineering rules
* `spec/AGENTS.md` — product and specification rules
* `skills/AGENTS.md` — agent skills and workflow instructions

Application source code lives at the repository root under `src/`.

## Getting Started

### Prerequisites

* Node.js
* npm

### Installation

Clone the repository and enter the project directory:

```bash
git clone <repository-url>
cd toodo
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL shown by Vite.

## Production Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Run linting if configured:

```bash
npm run lint
```

Run tests if configured:

```bash
npm test
```

## Design

Toodo uses an emerald-green and white visual system.

The design emphasizes:

* Clear hierarchy
* Generous whitespace
* Simple interactions
* Accessible controls
* Responsive layouts
* Minimal visual clutter

The interface is designed to make task management quick rather than turn a simple todo list into a complex project-management system.

## Privacy

Toodo does not require an account and does not send tasks to a server.

Task data is stored locally in the browser.

This also means that clearing the browser's site data can remove stored tasks. Use **Export** to create a portable backup.

## Scope

Toodo intentionally does not include:

* User authentication
* Backend APIs
* Cloud synchronization
* Multi-user collaboration
* Server-side notifications
* Calendar synchronization
* Team/project management
* AI task generation
* Payments or subscriptions

The focus is a polished, reliable, local-first task management experience.

## License

