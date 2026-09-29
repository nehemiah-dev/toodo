import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import type { Priority, Todo } from '../types.ts'
import CategoryTag from './CategoryTag.tsx'
import DueDateBadge from './DueDateBadge.tsx'
import PriorityBadge from './PriorityBadge.tsx'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, text: string, priority: Priority, category?: string, dueDate?: number) => void
}

function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority)
  const [editCategory, setEditCategory] = useState(todo.category ?? '')
  const [editDueDate, setEditDueDate] = useState(
    todo.dueDate ? new Date(todo.dueDate).toISOString().slice(0, 10) : '',
  )
  const editInputRef = useRef<HTMLInputElement>(null)

  function startEditing() {
    setEditText(todo.text)
    setEditPriority(todo.priority)
    setEditCategory(todo.category ?? '')
    setEditDueDate(todo.dueDate ? new Date(todo.dueDate).toISOString().slice(0, 10) : '')
    setIsEditing(true)
  }

  function commitEdit() {
    const trimmed = editText.trim()
    if (trimmed === '') {
      return
    }

    const dueDateMs = editDueDate ? new Date(editDueDate).getTime() : undefined
    const categoryValue = editCategory.trim() !== '' ? editCategory.trim() : undefined

    onEdit(todo.id, trimmed, editPriority, categoryValue, dueDateMs)
    setIsEditing(false)
  }

  function cancelEdit() {
    setEditText(todo.text)
    setEditPriority(todo.priority)
    setEditCategory(todo.category ?? '')
    setEditDueDate(todo.dueDate ? new Date(todo.dueDate).toISOString().slice(0, 10) : '')
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

  if (isEditing) {
    return (
      <li className="todo-item todo-item--editing" onKeyDown={handleItemKeyDown}>
        <form className="todo-item__edit-form" onSubmit={handleEditSubmit}>
          <div className="todo-item__edit-main">
            <label className="visually-hidden" htmlFor={`edit-text-${todo.id}`}>
              Edit task text
            </label>
            <input
              ref={editInputRef}
              id={`edit-text-${todo.id}`}
              className="todo-item__edit-input"
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              autoFocus
              autoComplete="off"
            />
          </div>

          <div className="todo-item__edit-metadata">
            <div className="todo-item__edit-field">
              <label htmlFor={`edit-priority-${todo.id}`} className="todo-item__edit-label">
                Priority
              </label>
              <select
                id={`edit-priority-${todo.id}`}
                className="todo-item__edit-select"
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value as Priority)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="todo-item__edit-field">
              <label htmlFor={`edit-category-${todo.id}`} className="todo-item__edit-label">
                Category
              </label>
              <input
                id={`edit-category-${todo.id}`}
                className="todo-item__edit-input todo-item__edit-input--small"
                type="text"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                placeholder="Optional"
                autoComplete="off"
              />
            </div>

            <div className="todo-item__edit-field">
              <label htmlFor={`edit-due-${todo.id}`} className="todo-item__edit-label">
                Due
              </label>
              <input
                id={`edit-due-${todo.id}`}
                className="todo-item__edit-input todo-item__edit-input--small"
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
              />
            </div>

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
              onClick={cancelEdit}
            >
              Cancel
            </button>
          </div>
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

      <div className="todo-item__badges">
        <PriorityBadge priority={todo.priority} />
        {todo.category && <CategoryTag category={todo.category} />}
        {todo.dueDate && <DueDateBadge dueDate={todo.dueDate} />}
      </div>

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
