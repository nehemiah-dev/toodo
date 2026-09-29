import AddTodoForm from './components/AddTodoForm.tsx'
import TodoFilters from './components/TodoFilters.tsx'
import TodoList from './components/TodoList.tsx'
import TodoSummary from './components/TodoSummary.tsx'
import { useTodos } from './hooks/useTodos.ts'
import { areAllCompleted, countActive } from './lib/filters.ts'
import type { Filter, Todo } from './types.ts'
import './App.css'

const SEED_TODOS: readonly Todo[] = [
  { id: 'seed-1', text: 'Read the project rules', completed: true, createdAt: 0 },
  { id: 'seed-2', text: 'Plan the todo app', completed: true, createdAt: 0 },
  { id: 'seed-3', text: 'Build the UI shell', completed: false, createdAt: 0 },
]

const ACTIVE_FILTER: Filter = 'all'

function App() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos(SEED_TODOS)
  const activeCount = countActive(todos)

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Toodo</h1>
        <p className="app__tagline">A small, no-nonsense task list.</p>
      </header>

      <main className="app__main">
        <AddTodoForm onAdd={addTodo} />
        <TodoFilters activeFilter={ACTIVE_FILTER} />
        <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
        <TodoSummary
          activeCount={activeCount}
          completedCount={todos.length - activeCount}
          allCompleted={areAllCompleted(todos)}
        />
      </main>

      <footer className="app__footer">Tasks stay in this browser.</footer>
    </div>
  )
}

export default App

