import type { Todo } from '../types.ts'

interface TodoItemProps {
  todo: Todo
}

function TodoItem({ todo }: TodoItemProps) {
  return (
    <li className="todo-item">
      <input
        className="todo-item__checkbox"
        type="checkbox"
        checked={todo.completed}
        readOnly
        aria-label={`Mark "${todo.text}" as ${todo.completed ? 'active' : 'completed'}`}
      />
      <span
        className={
          todo.completed
            ? 'todo-item__text todo-item__text--done'
            : 'todo-item__text'
        }
      >
        {todo.text}
      </span>
      <button
        type="button"
        className="todo-item__button"
        aria-label={`Edit "${todo.text}"`}
      >
        <span aria-hidden="true">✎</span>
      </button>
      <button
        type="button"
        className="todo-item__button todo-item__button--danger"
        aria-label={`Delete "${todo.text}"`}
      >
        <span aria-hidden="true">×</span>
      </button>
    </li>
  )
}

export default TodoItem
