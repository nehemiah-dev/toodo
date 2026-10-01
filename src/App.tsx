import { useEffect, useMemo, useRef, useState } from 'react'
import AddTodoForm from './components/AddTodoForm.tsx'
import AdvancedFilters, {
  type AdvancedFilterState,
} from './components/AdvancedFilters.tsx'
import SearchBar from './components/SearchBar.tsx'
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
  filterByPriority,
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
  const [sortBy, setSortBy] = useState<SortBy>('dueDate')
  const [searchQuery, setSearchQuery] = useState('')
  const [notice, setNotice] = useState('')
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterState>({
    priorities: new Set(),
    categories: new Set(),
  })

  const searchInputRef = useRef<HTMLInputElement>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const importFileRef = useRef<HTMLInputElement>(null)

  const activeCount = countActive(todos)
  const completedCount = todos.length - activeCount
  const availableCategories = useMemo(() => getUniqueCategories(todos), [todos])

  const visibleTodos = useMemo(() => {
    let result = filterTodos(todos, filter)
    result = searchTodos(result, searchQuery)
    result = filterByPriority(result, advancedFilters.priorities)
    result = filterByCategory(result, advancedFilters.categories)
    return sortTodos(result, sortBy)
  }, [todos, filter, searchQuery, advancedFilters, sortBy])

  // Auto-dismiss toast
  useEffect(() => {
    if (notice === '') return
    const t = window.setTimeout(() => setNotice(''), 3000)
    return () => window.clearTimeout(t)
  }, [notice])

  // Keyboard shortcuts: N → focus new task, / → focus search
  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.isComposing) return
      const target = event.target
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable || target.closest('input, textarea, select') !== null)
      ) return
      if (document.querySelector('dialog[open]')) return

      if (event.key.toLowerCase() === 'n') {
        event.preventDefault()
        titleInputRef.current?.focus()
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
    if (completedCount > 0 && window.confirm(`Clear ${completedCount} completed task${completedCount === 1 ? '' : 's'}?`)) {
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
    // Reset so the same file can be re-selected later
    event.target.value = ''

    let backup: TaskBackup
    try {
      backup = await readImportFile(file)
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not read backup.')
      return
    }

    // Prompt the user for import mode via confirm dialog.
    // Two questions to distinguish three paths: cancel, add, replace.
    const wantsReplace = window.confirm(
      `Found ${backup.tasks.length} task${backup.tasks.length === 1 ? '' : 's'}.\n\n` +
        'Replace all current tasks with the imported ones?\n\n' +
        'OK = Replace all   Cancel = Add to existing',
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

  return (
    <div className="app">
      {/* ── Header ───────────────────────────────────────────────────── */}
      <header className="app__header">
        <div className="app__header-start">
          <h1 className="app__title">Toodo</h1>
        </div>
        <div className="app__header-end">
          <button
            type="button"
            className="header-action"
            onClick={handleExport}
            disabled={todos.length === 0}
            title="Export tasks as JSON backup"
          >
            Export
          </button>
          <button
            type="button"
            className="header-action"
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
      </header>

      {/* ── Add form ─────────────────────────────────────────────────── */}
      <section className="app__create" aria-label="Add a new task">
        <AddTodoForm onAdd={handleAdd} titleInputRef={titleInputRef} />
      </section>

      {/* ── List panel ───────────────────────────────────────────────── */}
      <main className="app__panel">
        {/* Toolbar: search + status filters + sort + advanced filters */}
        <div className="toolbar">
          <div className="toolbar__top">
            <SearchBar
              inputRef={searchInputRef}
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
            />
            <TodoFilters
              activeFilter={filter}
              counts={{ all: todos.length, active: activeCount, completed: completedCount }}
              onFilterChange={setFilter}
            />
          </div>
          <div className="toolbar__bottom">
            <AdvancedFilters
              filters={advancedFilters}
              availableCategories={availableCategories}
              onChange={setAdvancedFilters}
            />
            <div className="sort-control">
              <label htmlFor="sort-todos">Sort</label>
              <select
                id="sort-todos"
                value={sortBy}
                onChange={(event) => {
                  const v = event.target.value
                  if (v === 'dueDate' || v === 'priority' || v === 'createdAt' || v === 'title') {
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

      <footer className="app__footer">Tasks stay in this browser.</footer>

      {notice && (
        <div className="app__toast" role="status" aria-live="polite">
          {notice}
        </div>
      )}
    </div>
  )
}

export default App
