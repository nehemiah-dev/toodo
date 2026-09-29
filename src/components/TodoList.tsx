import type { Todo } from '../types.ts'
import EmptyState from './EmptyState.tsx'
import TodoItem from './TodoItem.tsx'

interface TodoListProps {
  todos: readonly Todo[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return <EmptyState variant="no-todos" />
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}

export default TodoList

