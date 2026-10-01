import { FILTERS } from '../lib/filters.ts'
import type { Filter } from '../types.ts'

interface TodoFiltersProps {
  activeFilter: Filter | null
  counts: Record<Filter, number>
  onFilterChange: (filter: Filter) => void
}

function TodoFilters({ activeFilter, counts, onFilterChange }: TodoFiltersProps) {
  return (
    <ul className="filters__list">
      {FILTERS.map(({ value, label }) => {
        const isActive = activeFilter === value
        return (
          <li key={value}>
            <button
              type="button"
              className={isActive ? 'filters__button filters__button--active' : 'filters__button'}
              aria-pressed={isActive}
              aria-label={`${label} — ${counts[value]} task${counts[value] === 1 ? '' : 's'}`}
              onClick={() => onFilterChange(value)}
            >
              <span>{label}</span>
              <span className="filters__count" aria-hidden="true">
                {counts[value]}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default TodoFilters
