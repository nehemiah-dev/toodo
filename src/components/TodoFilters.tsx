import { FILTERS } from '../lib/filters.ts'
import type { Filter } from '../types.ts'

interface TodoFiltersProps {
  activeFilter: Filter
  counts: Record<Filter, number>
  onFilterChange: (filter: Filter) => void
}

function TodoFilters({
  activeFilter,
  counts,
  onFilterChange,
}: TodoFiltersProps) {
  return (
    <nav className="filters" aria-label="Filter tasks">
      <ul className="filters__list">
        {FILTERS.map(({ value, label }) => {
          const isActive = value === activeFilter

          return (
            <li key={value}>
              <button
                type="button"
                className={
                  isActive
                    ? 'filters__button filters__button--active'
                    : 'filters__button'
                }
                aria-pressed={isActive}
                aria-label={`${label} tasks (${counts[value]})`}
                onClick={() => onFilterChange(value)}
              >
                {label}
                <span className="filters__count" aria-hidden="true">
                  {counts[value]}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default TodoFilters

