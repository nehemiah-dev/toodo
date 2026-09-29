import { useRef, type FormEvent } from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
}

function SearchBar({ value, onChange, onClear }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  function handleClear() {
    onClear()
    inputRef.current?.focus()
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <label className="visually-hidden" htmlFor="search-todos">
        Search tasks
      </label>
      <input
        ref={inputRef}
        id="search-todos"
        className="search-bar__input"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search tasks..."
        autoComplete="off"
      />
      {value && (
        <button
          type="button"
          className="search-bar__clear"
          onClick={handleClear}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </form>
  )
}

export default SearchBar
