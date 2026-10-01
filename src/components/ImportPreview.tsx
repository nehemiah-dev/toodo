import { useEffect, useRef, useState } from 'react'
import type { ImportMode, TaskBackup } from '../lib/importExport.ts'

interface ImportPreviewProps {
  backup: TaskBackup | null
  onClose: () => void
  onImport: (mode: ImportMode) => void
}

function ImportPreview({ backup, onClose, onImport }: ImportPreviewProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [mode, setMode] = useState<ImportMode>('add')

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (backup && !dialog.open) {
      setMode('add')
      dialog.showModal()
    } else if (!backup && dialog.open) {
      dialog.close()
    }
  }, [backup])

  function handleBackdropClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === dialogRef.current) onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      className="import-preview"
      aria-labelledby="import-preview-title"
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      {backup && (
        <div className="import-preview__panel">
          <header className="import-preview__header">
            <h2 id="import-preview-title">Review backup</h2>
            <button
              type="button"
              className="task-modal__close"
              aria-label="Close import preview"
              onClick={onClose}
            >
              ×
            </button>
          </header>

          <p className="import-preview__summary">
            Exported {new Date(backup.exportedAt).toLocaleString()}. This backup contains{' '}
            {backup.tasks.length} {backup.tasks.length === 1 ? 'task' : 'tasks'} and{' '}
            {backup.categories.length} {backup.categories.length === 1 ? 'category' : 'categories'}.
          </p>

          <section className="import-preview__section" aria-label="Backup tasks">
            <h3>Tasks</h3>
            {backup.tasks.length > 0 ? (
              <ul className="import-preview__list">
                {backup.tasks.slice(0, 5).map((task) => (
                  <li key={task.id}>
                    <span>{task.title}</span>
                    <span>{task.category}</span>
                  </li>
                ))}
                {backup.tasks.length > 5 && (
                  <li className="import-preview__more">
                    And {backup.tasks.length - 5} more
                  </li>
                )}
              </ul>
            ) : (
              <p className="import-preview__empty">No tasks in this backup.</p>
            )}
          </section>

          <section className="import-preview__section" aria-label="Backup categories">
            <h3>Categories</h3>
            {backup.categories.length > 0 ? (
              <ul className="import-preview__categories">
                {backup.categories.map((category) => (
                  <li key={category}>{category}</li>
                ))}
              </ul>
            ) : (
              <p className="import-preview__empty">No categories in this backup.</p>
            )}
          </section>

          <fieldset className="import-preview__choices">
            <legend>How should this backup be applied?</legend>
            <label>
              <input
                type="radio"
                name="import-mode"
                value="add"
                checked={mode === 'add'}
                onChange={() => setMode('add')}
              />
              <span>Add to existing data</span>
            </label>
            <label>
              <input
                type="radio"
                name="import-mode"
                value="replace"
                checked={mode === 'replace'}
                onChange={() => setMode('replace')}
              />
              <span>Replace existing data</span>
            </label>
          </fieldset>

          <footer className="import-preview__actions">
            <button type="button" className="import-preview__cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="import-preview__apply"
              onClick={() => onImport(mode)}
            >
              Import backup
            </button>
          </footer>
        </div>
      )}
    </dialog>
  )
}

export default ImportPreview