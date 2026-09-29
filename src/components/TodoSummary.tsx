import { useRef } from 'react'

interface TodoSummaryProps {
  activeCount: number
  completedCount: number
  allCompleted: boolean
  onToggleAll: () => void
  onClearCompleted: () => void
  onExport: () => void
  onImport: (file: File) => void
}

function TodoSummary({
  activeCount,
  completedCount,
  allCompleted,
  onToggleAll,
  onClearCompleted,
  onExport,
  onImport,
}: TodoSummaryProps) {
  const isEmpty = activeCount + completedCount === 0
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleImportClick() {
    fileInputRef.current?.click()
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      onImport(file)
      // Reset input so the same file can be imported again
      event.target.value = ''
    }
  }

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

      <div className="summary__actions">
        <button type="button" className="summary__action" onClick={onExport} disabled={isEmpty}>
          Export
        </button>
        <button type="button" className="summary__action" onClick={handleImportClick}>
          Import
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          aria-label="Import todos from JSON file"
        />
      </div>
    </div>
  )
}

export default TodoSummary
