import { useRef, useState, type FormEvent } from 'react'

interface AddTodoFormProps {
  onAdd: (text: string) => void
}

function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [text, setText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const canSubmit = text.trim() !== ''

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!canSubmit) {
      return
    }

    onAdd(text)
    setText('')
    inputRef.current?.focus()
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
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
      <button type="submit" className="add-form__button" disabled={!canSubmit}>
        Add
      </button>
    </form>
  )
}

export default AddTodoForm

