import type { Todo } from '../types.ts'
import EmptyState from './EmptyState.tsx'
import TodoItem from './TodoItem.tsx'

interface TodoListProps {
  todos: readonly Todo[]
}

function TodoList({ todos }: TodoListProps) {
  if (todos.length === 0) {
    return <EmptyState variant="no-todos" />
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  )
}

export default TodoList
