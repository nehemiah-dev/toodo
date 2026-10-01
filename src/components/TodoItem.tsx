import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import type { Priority, Todo } from '../types.ts'
import CategoryTag from './CategoryTag.tsx'
import DueDateBadge from './DueDateBadge.tsx'
import PriorityBadge from './PriorityBadge.tsx'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (
    id: string,
    title: string,
    description: string,
    category: string,
    dueDate: string,
    priority: Priority,
  ) => void
}

function isOverdue(todo: Todo): boolean {
  if (todo.completed) return false
  // Compare date strings directly — both are YYYY-MM-DD
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  return todo.dueDate < `${yyyy}-${mm}-${dd}`
}

function formatCompletedDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDescription, setEditDescription] = useState(todo.description ?? '')
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority)
  const [editCategory, setEditCategory] = useState(todo.category)
  const [editDueDate, setEditDueDate] = useState(todo.dueDate)
  const editTitleRef = useRef<HTMLInputElement>(null)

  const overdue = isOverdue(todo)

  function startEditing() {
    setEditTitle(todo.title)
    setEditDescription(todo.description ?? '')
    setEditPriority(todo.priority)
    setEditCategory(todo.category)
    setEditDueDate(todo.dueDate)
    setIsEditing(true)
  }

  function commitEdit() {
    const trimmedTitle = editTitle.trim()
    const trimmedCategory = editCategory.trim()
    if (trimmedTitle === '' || trimmedCategory === '' || editDueDate === '') return
    onEdit(todo.id, trimmedTitle, editDescription, trimmedCategory, editDueDate, editPriority)
    setIsEditing(false)
  }

  function cancelEdit() {
    setEditTitle(todo.title)
    setEditDescription(todo.description ?? '')
    setEditPriority(todo.priority)
    setEditCategory(todo.category)
    setEditDueDate(todo.dueDate)
    setIsEditing(false)
  }

  function handleEditSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    commitEdit()
  }

  function handleItemKeyDown(event: KeyboardEvent<HTMLLIElement>) {
    if (event.key === 'Escape') {
      if (isEditing) cancelEdit()
      else setIsConfirmingDelete(false)
    }
  }

  // ── Editing state ────────────────────────────────────────────────────
  if (isEditing) {
    return (
      <li className="todo-item todo-item--editing" onKeyDown={handleItemKeyDown}>
        <form className="todo-item__edit-form" onSubmit={handleEditSubmit}>
          <div className="todo-item__edit-main">
            <label className="visually-hidden" htmlFor={`edit-title-${todo.id}`}>
              Task title
            </label>
            <input
              ref={editTitleRef}
              id={`edit-title-${todo.id}`}
              className="todo-item__edit-input"
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              autoFocus
              autoComplete="off"
              required
            />
          </div>

          <label className="visually-hidden" htmlFor={`edit-desc-${todo.id}`}>
            Description (optional)
          </label>
          <textarea
            id={`edit-desc-${todo.id}`}
            className="todo-item__edit-input"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={2}
          />

          <div className="todo-item__edit-metadata">
            <div className="todo-item__edit-field">
              <label htmlFor={`edit-priority-${todo.id}`} className="todo-item__edit-label">
                Priority
              </label>
              <select
                id={`edit-priority-${todo.id}`}
                className="todo-item__edit-select"
                value={editPriority}
                onChange={(e) => {
                  const v = e.target.value
                  if (v === 'low' || v === 'medium' || v === 'high') setEditPriority(v)
                }}
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
                list={`edit-cat-suggestions-${todo.id}`}
                className="todo-item__edit-input todo-item__edit-input--small"
                type="text"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                autoComplete="off"
                required
              />
              <datalist id={`edit-cat-suggestions-${todo.id}`}>
                <option value="Work" />
                <option value="Personal" />
                <option value="Learning" />
              </datalist>
            </div>

            <div className="todo-item__edit-field">
              <label htmlFor={`edit-due-${todo.id}`} className="todo-item__edit-label">
                Due date
              </label>
              <input
                id={`edit-due-${todo.id}`}
                className="todo-item__edit-input todo-item__edit-input--small"
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="todo-item__confirm-button"
              disabled={
                editTitle.trim() === '' ||
                editCategory.trim() === '' ||
                editDueDate === ''
              }
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

  // ── Display state ────────────────────────────────────────────────────
  const itemClass = [
    'todo-item',
    overdue ? 'todo-item--overdue' : '',
    todo.completed ? 'todo-item--completed' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <li className={itemClass} onKeyDown={handleItemKeyDown}>
      {/* Checkbox */}
      <input
        className="todo-item__checkbox"
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={`Mark "${todo.title}" as ${todo.completed ? 'active' : 'completed'}`}
      />

      {/* Title row — includes overdue tag when applicable */}
      <div className="todo-item__title-row">
        {overdue && (
          <span className="todo-item__overdue-tag" aria-label="Overdue">
            <span aria-hidden="true">⚠</span> Overdue
          </span>
        )}
        <span
          className={
            todo.completed ? 'todo-item__text todo-item__text--done' : 'todo-item__text'
          }
        >
          {todo.title}
        </span>
      </div>

      {/* Actions */}
      <div className="todo-item__actions">
        {isConfirmingDelete ? (
          <span className="todo-item__confirm">
            <span className="todo-item__confirm-text">Delete?</span>
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
              aria-label={`Edit "${todo.title}"`}
              onClick={startEditing}
            >
              <span aria-hidden="true">✎</span>
            </button>
            <button
              type="button"
              className="todo-item__button todo-item__button--danger"
              aria-label={`Delete "${todo.title}"`}
              onClick={() => setIsConfirmingDelete(true)}
            >
              <span aria-hidden="true">🗑</span>
            </button>
          </>
        )}
      </div>

      {/* Description */}
      {todo.description && (
        <p className="todo-item__description">{todo.description}</p>
      )}

      {/* Metadata row */}
      <div className="todo-item__meta">
        <PriorityBadge priority={todo.priority} />
        <CategoryTag category={todo.category} />
        <DueDateBadge dueDate={todo.dueDate} completed={todo.completed} />
        {todo.completed && (
          <span className="todo-item__completed-date">
            Completed {formatCompletedDate(todo.updatedAt)}
          </span>
        )}
      </div>
    </li>
  )
}

export default TodoItem
