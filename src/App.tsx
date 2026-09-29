import { useMemo, useState } from 'react'
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
import {
  areAllCompleted,
  countActive,
  filterByCategory,
  filterByPriority,
  filterTodos,
  getUniqueCategories,
  searchTodos,
} from './lib/filters.ts'
import type { Filter } from './types.ts'
import './App.css'

function App() {
  const { todos, addTodo, toggleTodo, deleteTodo, editTodo, toggleAll, clearCompleted } = useTodos()
  const [filter, setFilter] = useState<Filter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterState>({
    priorities: new Set(),
    categories: new Set(),
  })

  const activeCount = countActive(todos)
  const completedCount = todos.length - activeCount
  const availableCategories = useMemo(() => getUniqueCategories(todos), [todos])

  const visibleTodos = useMemo(() => {
    let filtered = filterTodos(todos, filter)
    filtered = searchTodos(filtered, searchQuery)
    filtered = filterByPriority(filtered, advancedFilters.priorities)
    filtered = filterByCategory(filtered, advancedFilters.categories)
    return filtered
  }, [todos, filter, searchQuery, advancedFilters])

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__header-content">
          <div>
            <h1 className="app__title">Toodo</h1>
            <p className="app__tagline">A small, no-nonsense task list.</p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="app__main">
        <AddTodoForm onAdd={addTodo} />
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
        <TodoFilters
          activeFilter={filter}
          counts={{
            all: todos.length,
            active: activeCount,
            completed: completedCount,
          }}
          onFilterChange={setFilter}
        />
        <AdvancedFilters
          filters={advancedFilters}
          availableCategories={availableCategories}
          onChange={setAdvancedFilters}
        />
        <TodoList
          todos={visibleTodos}
          emptyVariant={todos.length === 0 ? 'no-todos' : 'no-matches'}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEdit={editTodo}
        />
        <TodoSummary
          activeCount={activeCount}
          completedCount={completedCount}
          allCompleted={areAllCompleted(todos)}
          onToggleAll={toggleAll}
          onClearCompleted={clearCompleted}
        />
      </main>

      <footer className="app__footer">Tasks stay in this browser.</footer>
    </div>
  )
}

export default App


