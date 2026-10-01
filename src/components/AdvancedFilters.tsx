import type { Priority } from '../types.ts'

export interface AdvancedFilterState {
  priorities: Set<Priority>
  categories: Set<string>
}

interface AdvancedFiltersProps {
  filters: AdvancedFilterState
  availableCategories: readonly string[]
  onChange: (filters: AdvancedFilterState) => void
}

function AdvancedFilters({
  filters,
  availableCategories,
  onChange,
}: AdvancedFiltersProps) {
  function togglePriority(priority: Priority) {
    const newPriorities = new Set(filters.priorities)
    if (newPriorities.has(priority)) {
      newPriorities.delete(priority)
    } else {
      newPriorities.add(priority)
    }
    onChange({ ...filters, priorities: newPriorities })
  }

  function toggleCategory(category: string) {
    const newCategories = new Set(filters.categories)
    if (newCategories.has(category)) {
      newCategories.delete(category)
    } else {
      newCategories.add(category)
    }
    onChange({ ...filters, categories: newCategories })
  }

  const hasActiveFilters = filters.priorities.size > 0 || filters.categories.size > 0

  return (
    <div className="advanced-filters">
      <details className="advanced-filters__details">
        <summary className="advanced-filters__summary">
          <span>Advanced filters</span>
          {hasActiveFilters && (
            <span className="advanced-filters__badge" aria-label="Active filters">
              {filters.priorities.size + filters.categories.size}
            </span>
          )}
        </summary>

        <div className="advanced-filters__content">
          <div className="advanced-filters__section">
            <h3 className="advanced-filters__heading">Priority</h3>
            <div className="advanced-filters__options">
              {(['low', 'medium', 'high'] as const).map((priority) => (
                <label key={priority} className="advanced-filters__option">
                  <input
                    type="checkbox"
                    checked={filters.priorities.has(priority)}
                    onChange={() => togglePriority(priority)}
                  />
                  <span className="advanced-filters__label">
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {availableCategories.length > 0 && (
            <div className="advanced-filters__section">
              <h3 className="advanced-filters__heading">Category</h3>
              <div className="advanced-filters__options">
                {availableCategories.map((category) => (
                  <label key={category} className="advanced-filters__option">
                    <input
                      type="checkbox"
                      checked={filters.categories.has(category)}
                      onChange={() => toggleCategory(category)}
                    />
                    <span className="advanced-filters__label">{category}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </details>
    </div>
  )
}

export default AdvancedFilters
