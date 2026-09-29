import { useState, type KeyboardEvent } from 'react'
import type { Todo } from '../types.ts'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

  function handleKeyDown(event: KeyboardEvent<HTMLLIElement>) {
    if (event.key === 'Escape') {
      setIsConfirmingDelete(false)
    }
  }

  return (
    <li className="todo-item" onKeyDown={handleKeyDown}>
      <input
        className="todo-item__checkbox"
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
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

      {isConfirmingDelete ? (
        <span className="todo-item__confirm">
          <span className="todo-item__confirm-text">Delete this task?</span>
          <button
            type="button"
            className="todo-item__confirm-button todo-item__confirm-button--danger"
            onClick={() => onDelete(todo.id)}
            autoFocus
          >
            Delete
          </button>
          <button
            type="button"
            className="todo-item__confirm-button"
            onClick={() => setIsConfirmingDelete(false)}
          >
            Cancel
          </button>
        </span>
      ) : (
        <>
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
            onClick={() => setIsConfirmingDelete(true)}
          >
            <span aria-hidden="true">×</span>
          </button>
        </>
      )}
    </li>
  )
}

export default TodoItem

