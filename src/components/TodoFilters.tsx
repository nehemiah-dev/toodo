import { FILTERS } from '../lib/filters.ts'
import type { Filter } from '../types.ts'

interface TodoFiltersProps {
  activeFilter: Filter
}

function TodoFilters({ activeFilter }: TodoFiltersProps) {
  return (
    <nav className="filters" aria-label="Filter tasks">
      <ul className="filters__list">
        {FILTERS.map(({ value, label }) => (
          <li key={value}>
            <button
              type="button"
              className={
                value === activeFilter
                  ? 'filters__button filters__button--active'
                  : 'filters__button'
              }
              aria-pressed={value === activeFilter}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default TodoFilters
