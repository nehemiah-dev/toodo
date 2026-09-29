import { useMemo, useState } from 'react'
import AddTodoForm from './components/AddTodoForm.tsx'
import TodoFilters from './components/TodoFilters.tsx'
import TodoList from './components/TodoList.tsx'
import TodoSummary from './components/TodoSummary.tsx'
import { useTodos } from './hooks/useTodos.ts'
import { areAllCompleted, countActive, filterTodos } from './lib/filters.ts'
import type { Filter } from './types.ts'
import './App.css'

function App() {
  const { todos, addTodo, toggleTodo, deleteTodo, editTodo, toggleAll, clearCompleted } = useTodos()
  const [filter, setFilter] = useState<Filter>('all')

  const activeCount = countActive(todos)
  const completedCount = todos.length - activeCount
  const visibleTodos = useMemo(() => filterTodos(todos, filter), [todos, filter])

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Toodo</h1>
        <p className="app__tagline">A small, no-nonsense task list.</p>
      </header>

      <main className="app__main">
        <AddTodoForm onAdd={addTodo} />
        <TodoFilters
          activeFilter={filter}
          counts={{
            all: todos.length,
            active: activeCount,
            completed: completedCount,
          }}
          onFilterChange={setFilter}
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


