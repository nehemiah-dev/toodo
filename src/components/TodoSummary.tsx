interface TodoSummaryProps {
  activeCount: number
  completedCount: number
  allCompleted: boolean
}

function TodoSummary({
  activeCount,
  completedCount,
  allCompleted,
}: TodoSummaryProps) {
  const isEmpty = activeCount + completedCount === 0

  return (
    <div className="summary">
      <label className="summary__toggle">
        <input type="checkbox" checked={allCompleted} readOnly disabled={isEmpty} />
        <span>Toggle all</span>
      </label>

      <p className="summary__count" aria-live="polite">
        <strong>{activeCount}</strong> {activeCount === 1 ? 'task' : 'tasks'} left
      </p>

      {completedCount > 0 && (
        <button type="button" className="summary__clear">
          Clear completed ({completedCount})
        </button>
      )}
    </div>
  )
}

export default TodoSummary
