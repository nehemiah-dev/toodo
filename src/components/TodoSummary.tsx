interface TodoSummaryProps {
  activeCount: number
  completedCount: number
  allCompleted: boolean
  onToggleAll: () => void
  onClearCompleted: () => void
}

function TodoSummary({
  activeCount,
  completedCount,
  allCompleted,
  onToggleAll,
  onClearCompleted,
}: TodoSummaryProps) {
  const isEmpty = activeCount + completedCount === 0

  return (
    <div className="summary">
      <label className="summary__toggle">
        <input
          type="checkbox"
          checked={allCompleted}
          onChange={onToggleAll}
          disabled={isEmpty}
          aria-label="Toggle all tasks"
        />
        <span>Toggle all</span>
      </label>

      <p className="summary__count" aria-live="polite">
        <strong>{activeCount}</strong> {activeCount === 1 ? 'task' : 'tasks'} left
      </p>

      {completedCount > 0 && (
        <button type="button" className="summary__clear" onClick={onClearCompleted}>
          Clear completed ({completedCount})
        </button>
      )}
    </div>
  )
}

export default TodoSummary
