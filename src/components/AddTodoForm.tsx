import { useRef, useState, type FormEvent } from 'react'
import type { Priority } from '../types.ts'

interface AddTodoFormProps {
  onAdd: (text: string, priority: Priority, category?: string, dueDate?: number) => void
}

function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [text, setText] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [category, setCategory] = useState('')
  const [dueDate, setDueDate] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const canSubmit = text.trim() !== ''

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!canSubmit) {
      return
    }

    const dueDateMs = dueDate ? new Date(dueDate).getTime() : undefined
    const categoryValue = category.trim() !== '' ? category.trim() : undefined

    onAdd(text, priority, categoryValue, dueDateMs)
    setText('')
    setCategory('')
    setDueDate('')
    setPriority('medium')
    inputRef.current?.focus()
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <div className="add-form__main">
        <label className="visually-hidden" htmlFor="new-todo">
          New task
        </label>
        <input
          ref={inputRef}
          id="new-todo"
          name="text"
          className="add-form__input"
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="What needs doing?"
          autoComplete="off"
        />
      </div>

      <div className="add-form__metadata">
        <div className="add-form__field">
          <label htmlFor="new-priority" className="add-form__label">
            Priority
          </label>
          <select
            id="new-priority"
            className="add-form__select"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
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
            className="add-form__input add-form__input--small"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Optional"
            autoComplete="off"
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
          />
        </div>

        <button type="submit" className="add-form__button" disabled={!canSubmit}>
          Add
        </button>
      </div>
    </form>
  )
}

export default AddTodoForm
