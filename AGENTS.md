# Toodo — Agent Instructions

## Project

Toodo is a frontend-only, local-first todo application.

**Stack:** React, Vite, TypeScript, CSS, `localStorage`

No backend, authentication, database, or cloud synchronization.

### Structure

```text
/
├── AGENTS.md
├── README.md
├── package.json
├── src/
├── spec/
│   └── AGENTS.md
└── skills/
    └── AGENTS.md
```

Application code lives in `src/`. Do not create a `frontend/` directory.

## Instructions

Before making changes:

1. Read this file.
2. Read applicable `AGENTS.md` files.
3. Read relevant files in `spec/`.
4. Inspect the existing implementation.

Priority when instructions conflict:

1. Current user request
2. Product specification
3. Agent instructions
4. Existing implementation
5. General conventions

Do not silently change product requirements.

## Engineering Rules

* Keep the application frontend-only.
* Use `localStorage` for persistence.
* Maintain one source of truth for task data.
* Derive search, filters, counts, and sorting from task state.
* Keep persistence logic separate from UI components.
* Prefer simple React state; avoid unnecessary libraries and abstractions.
* Preserve existing functionality.
* Do not rewrite unrelated code.

## Data

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

* `dueDate` is required.
* Use unique IDs, preferably `crypto.randomUUID()`.
* Treat `localStorage` and imported JSON as untrusted input.
* Validate data before using it.
* Import/export formats must be versioned.
* Do not persist derived task collections.

## TypeScript

* Keep `"strict": true`.
* Do not modify `tsconfig` without explicit permission.
* Do not use `any`, `@ts-ignore`, or `@ts-expect-error`.
* Avoid `as` and non-null assertions (`!`).
* If either is genuinely unavoidable, stop and explain why before using it.
* Fix the underlying cause of type errors rather than suppressing them.

## UX & Accessibility

Maintain:

* Responsive desktop, tablet, and mobile behavior.
* Semantic HTML.
* Keyboard accessibility.
* Visible focus states.
* Accessible controls and dialogs.
* Clear empty and error/success states.
* Confirmation for destructive actions.

Do not rely on color alone to communicate important information.

## Verification

Use only scripts defined in `package.json`.

Before every commit, run:

```bash
npm run build
npm run lint
```

Both must pass before committing.

Run tests when available and relevant.

Never claim a check was run unless it actually was.

## Git

* Commit every meaningful, working change.
* Keep each commit focused on one logical change.
* Do not include unrelated files.
* Use Conventional Commits: `<type>: <description>`.
* Use types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`.
* Use lowercase, imperative descriptions with no trailing period.
* Never push, force-push, reset with `--hard`, or rewrite history.
* After each commit, report the commit hash and what was committed.

## Completion

Before finishing:

* Verify the requested behavior.
* Check relevant edge cases.
* Run required checks.
* Update relevant documentation or specification when necessary.

Final reports should briefly state:

* What changed
* Checks performed
* Known limitations
