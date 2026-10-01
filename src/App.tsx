import { useEffect, useMemo, useRef, useState } from 'react'
import SearchBar from './components/SearchBar.tsx'
import TaskModal from './components/TaskModal.tsx'
import ThemeToggle from './components/ThemeToggle.tsx'
import TodoFilters from './components/TodoFilters.tsx'
import TodoList from './components/TodoList.tsx'
import TodoSummary from './components/TodoSummary.tsx'
import { useTodos } from './hooks/useTodos.ts'
import type { ImportMode, TaskBackup } from './lib/importExport.ts'
import {
  areAllCompleted,
  countActive,
  filterByCategory,
  filterTodos,
  getUniqueCategories,
  searchTodos,
  sortTodos,
} from './lib/filters.ts'
import type { Filter, Priority, SortBy } from './types.ts'
import './App.css'

function App() {
  const {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    toggleAll,
    clearCompleted,
    exportTodos,
    readImportFile,
    importTodos,
  } = useTodos()

  const [filter, setFilter] = useState<Filter>('all')
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortBy>('dueDate')
  const [searchQuery, setSearchQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [notice, setNotice] = useState('')

  const searchInputRef = useRef<HTMLInputElement>(null)
  const importFileRef = useRef<HTMLInputElement>(null)

  const activeCount = countActive(todos)
  const completedCount = todos.length - activeCount
  const availableCategories = useMemo(() => getUniqueCategories(todos), [todos])

  const visibleTodos = useMemo(() => {
    let result = filterTodos(todos, filter)
    result = searchTodos(result, searchQuery)
    if (categoryFilter !== null) {
      result = filterByCategory(result, new Set([categoryFilter]))
    }
    return sortTodos(result, sortBy)
  }, [todos, filter, searchQuery, categoryFilter, sortBy])

  // Auto-dismiss toast
  useEffect(() => {
    if (notice === '') return
    const t = window.setTimeout(() => setNotice(''), 3000)
    return () => window.clearTimeout(t)
  }, [notice])

  // Keyboard shortcuts: N → open modal, / → focus search
  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.isComposing) return
      const target = event.target
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.closest('input, textarea, select') !== null)
      )
        return
      if (document.querySelector('dialog[open]')) return

      if (event.key.toLowerCase() === 'n') {
        event.preventDefault()
        setModalOpen(true)
      } else if (event.key === '/') {
        event.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  function handleAdd(
    title: string,
    description: string,
    category: string,
    dueDate: string,
    priority: Priority,
  ) {
    addTodo(title, description, category, dueDate, priority)
    setNotice('Task added.')
  }

  function handleToggle(id: string) {
    const wasCompleted = todos.find((t) => t.id === id)?.completed
    toggleTodo(id)
    setNotice(wasCompleted ? 'Task marked active.' : 'Task completed.')
  }

  function handleDelete(id: string) {
    deleteTodo(id)
    setNotice('Task deleted.')
  }

  function handleEdit(
    id: string,
    title: string,
    description: string,
    category: string,
    dueDate: string,
    priority: Priority,
  ) {
    editTodo(id, title, description, category, dueDate, priority)
    setNotice('Task updated.')
  }

  function handleClearCompleted() {
    if (
      completedCount > 0 &&
      window.confirm(
        `Clear ${completedCount} completed task${completedCount === 1 ? '' : 's'}?`,
      )
    ) {
      clearCompleted()
      setNotice('Completed tasks cleared.')
    }
  }

  function handleToggleAll() {
    const willComplete = !areAllCompleted(todos)
    toggleAll()
    setNotice(willComplete ? 'All tasks completed.' : 'All tasks marked active.')
  }

  function handleExport() {
    exportTodos()
    setNotice('Backup exported.')
  }

  async function handleImportFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    event.target.value = ''

    let backup: TaskBackup
    try {
      backup = await readImportFile(file)
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : 'Could not read backup.',
      )
      return
    }

    const wantsReplace = window.confirm(
      `Found ${backup.tasks.length} task${backup.tasks.length === 1 ? '' : 's'}.\n\n` +
        'Replace all current tasks?\n\nOK = Replace   Cancel = Add to existing',
    )
    const mode: ImportMode = wantsReplace ? 'replace' : 'add'

    if (mode === 'replace' && todos.length > 0) {
      const confirmed = window.confirm(
        `This will permanently remove your ${todos.length} current task${todos.length === 1 ? '' : 's'}. Continue?`,
      )
      if (!confirmed) return
    }

    importTodos(backup, mode)
    setNotice(
      mode === 'replace'
        ? `Replaced with ${backup.tasks.length} imported task${backup.tasks.length === 1 ? '' : 's'}.`
        : `Added ${backup.tasks.length} task${backup.tasks.length === 1 ? '' : 's'}.`,
    )
  }

  // Derive a page title based on the active category filter
  const pageTitle = categoryFilter !== null
    ? categoryFilter
    : { all: 'Tasks', active: 'Active tasks', completed: 'Completed tasks' }[filter]

  const taskCount = visibleTodos.length

  return (
    <div className="app">
      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      <aside className="sidebar" aria-label="Navigation">
        {/* Logo */}
        <div className="sidebar__logo">
          <span className="sidebar__logo-mark" aria-hidden="true">✓</span>
          <span className="sidebar__logo-text">Toodo</span>
        </div>

        {/* Status nav */}
        <nav aria-label="Filter tasks by status">
          <TodoFilters
            activeFilter={categoryFilter !== null ? null : filter}
            counts={{ all: todos.length, active: activeCount, completed: completedCount }}
            onFilterChange={(f) => {
              setFilter(f)
              setCategoryFilter(null)
            }}
          />
        </nav>

        {/* Categories */}
        {availableCategories.length > 0 && (
          <section className="sidebar__section" aria-label="Filter by category">
            <h2 className="sidebar__section-title">Categories</h2>
            <ul className="sidebar__category-list">
              {availableCategories.map((cat) => (
                <li key={cat}>
                  <button
                    type="button"
                    className={`sidebar__category-btn${categoryFilter === cat ? ' sidebar__category-btn--active' : ''}`}
                    onClick={() =>
                      setCategoryFilter(categoryFilter === cat ? null : cat)
                    }
                    aria-pressed={categoryFilter === cat}
                  >
                    <span className="sidebar__category-dot" aria-hidden="true" />
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Sidebar footer: data actions + theme */}
        <div className="sidebar__footer">
          <button
            type="button"
            className="sidebar__action"
            onClick={handleExport}
            disabled={todos.length === 0}
            title="Export tasks as JSON backup"
          >
            Export
          </button>
          <button
            type="button"
            className="sidebar__action"
            onClick={() => importFileRef.current?.click()}
            title="Import tasks from JSON backup"
          >
            Import
          </button>
          <input
            ref={importFileRef}
            type="file"
            accept="application/json"
            onChange={handleImportFile}
            className="visually-hidden"
            aria-label="Import tasks from JSON backup file"
          />
          <ThemeToggle />
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <main className="main" id="main-content">
        {/* Page header */}
        <div className="main__header">
          <h1 className="main__title">
            {pageTitle}
            <span className="main__count" aria-label={`${taskCount} tasks`}>
              ({taskCount})
            </span>
          </h1>

          <div className="main__header-actions">
            <div className="sort-control">
              <label htmlFor="sort-todos" className="sort-control__label">
                Sort
              </label>
              <select
                id="sort-todos"
                className="sort-control__select"
                value={sortBy}
                onChange={(event) => {
                  const v = event.target.value
                  if (
                    v === 'dueDate' ||
                    v === 'priority' ||
                    v === 'createdAt' ||
                    v === 'title'
                  ) {
                    setSortBy(v)
                  }
                }}
              >
                <option value="dueDate">Due date</option>
                <option value="priority">Priority</option>
                <option value="createdAt">Created</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search */}
        <SearchBar
          inputRef={searchInputRef}
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />

        {/* Task list */}
        <TodoList
          todos={visibleTodos}
          emptyVariant={todos.length === 0 ? 'no-todos' : 'no-matches'}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />

        {/* Summary bar */}
        <TodoSummary
          activeCount={activeCount}
          completedCount={completedCount}
          allCompleted={areAllCompleted(todos)}
          onToggleAll={handleToggleAll}
          onClearCompleted={handleClearCompleted}
        />
      </main>

      {/* ── FAB ──────────────────────────────────────────────────────── */}
      <button
        type="button"
        className="fab"
        onClick={() => setModalOpen(true)}
        aria-label="Add a new task"
        title="Add task (N)"
      >
        <span aria-hidden="true">+</span>
        <span>Add Task</span>
      </button>

      {/* ── Task modal ───────────────────────────────────────────────── */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAdd}
      />

      {/* ── Toast ────────────────────────────────────────────────────── */}
      {notice && (
        <div className="app__toast" role="status" aria-live="polite">
          {notice}
        </div>
      )}
    </div>
  )
}

export default App
