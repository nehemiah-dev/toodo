import EmptyState, { type EmptyStateVariant } from './EmptyState.tsx'
import TodoItem from './TodoItem.tsx'
import type { Todo } from '../types.ts'

interface TodoListProps {
  todos: readonly Todo[]
  emptyVariant: EmptyStateVariant
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, text: string) => void
}

function TodoList({
  todos,
  emptyVariant,
  onToggle,
  onDelete,
  onEdit,
}: TodoListProps) {
  if (todos.length === 0) {
    return <EmptyState variant={emptyVariant} />
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  )
}

export default TodoList


