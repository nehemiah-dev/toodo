import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import type { Todo } from '../types.ts'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, text: string) => void
}

function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)
  const editInputRef = useRef<HTMLInputElement>(null)

  function startEditing() {
    setEditText(todo.text)
    setIsEditing(true)
    // Focus is handled by the autoFocus attribute on the input
  }

  function commitEdit() {
    const trimmed = editText.trim()
    if (trimmed !== '' && trimmed !== todo.text) {
      onEdit(todo.id, trimmed)
    }
    setIsEditing(false)
  }

  function cancelEdit() {
    setEditText(todo.text)
    setIsEditing(false)
  }

  function handleEditSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    commitEdit()
  }

  function handleItemKeyDown(event: KeyboardEvent<HTMLLIElement>) {
    if (event.key === 'Escape') {
      if (isEditing) {
        cancelEdit()
      } else {
        setIsConfirmingDelete(false)
      }
    }
  }

  function handleEditKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      // Prevent the li handler from also firing
      event.stopPropagation()
      cancelEdit()
    }
  }

  if (isEditing) {
    return (
      <li className="todo-item" onKeyDown={handleItemKeyDown}>
        <form className="todo-item__edit-form" onSubmit={handleEditSubmit}>
          <label className="visually-hidden" htmlFor={`edit-${todo.id}`}>
            Edit task
          </label>
          <input
            ref={editInputRef}
            id={`edit-${todo.id}`}
            className="todo-item__edit-input"
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleEditKeyDown}
            autoFocus
            autoComplete="off"
          />
          <button
            type="submit"
            className="todo-item__confirm-button"
            disabled={editText.trim() === ''}
          >
            Save
          </button>
          <button
            type="button"
            className="todo-item__confirm-button"
            onMouseDown={(e) => {
              // Prevent the input's onBlur from firing before this click
              e.preventDefault()
            }}
            onClick={cancelEdit}
          >
            Cancel
          </button>
        </form>
      </li>
    )
  }

  return (
    <li className="todo-item" onKeyDown={handleItemKeyDown}>
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
            onClick={startEditing}
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
