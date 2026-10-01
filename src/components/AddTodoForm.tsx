import { useState, type FormEvent, type RefObject } from 'react'
import type { Priority } from '../types.ts'

interface AddTodoFormProps {
  onAdd: (title: string, description: string, category: string, dueDate: string, priority: Priority) => void
  titleInputRef: RefObject<HTMLInputElement | null>
}

function AddTodoForm({ onAdd, titleInputRef }: AddTodoFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [category, setCategory] = useState('')
  const [dueDate, setDueDate] = useState('')
  const canSubmit = title.trim() !== '' && category.trim() !== '' && dueDate !== ''

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!canSubmit) {
      return
    }

    onAdd(title, description, category, dueDate, priority)
    setTitle('')
    setDescription('')
    setCategory('')
    setDueDate('')
    setPriority('medium')
    titleInputRef.current?.focus()
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <div className="add-form__main">
        <label className="visually-hidden" htmlFor="new-todo">
          Task title
        </label>
        <input
          ref={titleInputRef}
          id="new-todo"
          name="text"
          className="add-form__input"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What needs doing?"
          required
          autoComplete="off"
        />
      </div>

      <label className="visually-hidden" htmlFor="new-description">
        Description (optional)
      </label>
      <textarea
        id="new-description"
        className="add-form__input"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Add a description (optional)"
        rows={2}
      />

      <div className="add-form__metadata">
        <div className="add-form__field">
          <label htmlFor="new-priority" className="add-form__label">
            Priority
          </label>
          <select
            id="new-priority"
            className="add-form__select"
            value={priority}
            onChange={(event) => {
              const value = event.target.value
              if (value === 'low' || value === 'medium' || value === 'high') {
                setPriority(value)
              }
            }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="add-form__field">
          <label htmlFor="new-category" className="add-form__label">
            Category
          </label>
          <input
            id="new-category"
            list="category-suggestions"
            className="add-form__input add-form__input--small"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Work"
            autoComplete="off"
            required
          />
        </div>

        <div className="add-form__field">
          <label htmlFor="new-due-date" className="add-form__label">
            Due date
          </label>
          <input
            id="new-due-date"
            className="add-form__input add-form__input--small"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="add-form__button" disabled={!canSubmit}>
          Add
        </button>
      </div>
      <datalist id="category-suggestions">
        <option value="Work" />
        <option value="Personal" />
        <option value="Learning" />
      </datalist>
    </form>
  )
}

export default AddTodoForm
